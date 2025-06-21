import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import axios from 'axios';
import { uploadToImgBB } from '../utils/upload-to-imgbb';

dotenv.config();

const {
    TESTRAIL_HOST,
    TESTRAIL_USER,
    TESTRAIL_API_KEY,
    TESTRAIL_PROJECT_ID,
    TESTRAIL_SUITE_ID,
    BUILD_NUMBER,
    JENKINS_BASE_URL,
} = process.env;

const jenkinsBaseUrl = JENKINS_BASE_URL || 'http://localhost:9090';

const reportPath = path.join(process.cwd(), 'reports', 'report.json');

if (!fs.existsSync(reportPath)) {
    console.error(`❌ Report file not found at: ${reportPath}`);
    process.exit(1);
}

interface StepResult {
    status: string;
    error_message?: string;
}

interface Test {
    title: string[];
    outcome: { verdict: string };
    duration: number;
    error?: string;
}

interface Suite {
    specs: {
        tests: Test[];
    }[];
}

interface PlaywrightReport {
    suites: Suite[];
}

const reportData: PlaywrightReport = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

function getLatestScreenshotForTitle(title: string): string | null {
    const folder = path.join(process.cwd(), 'screenshots');
    if (!fs.existsSync(folder)) return null;

    const baseName = title.replace(/\s+/g, '_').toLowerCase();

    const files = fs
        .readdirSync(folder)
        .filter((file) => file.startsWith(baseName))
        .map((file) => ({
            name: file,
            time: fs.statSync(path.join(folder, file)).mtime.getTime(),
        }))
        .sort((a, b) => b.time - a.time);

    return files.length > 0 ? files[0].name : null;
}

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.config?.url?.includes('imgbb')) {
            return Promise.resolve({ data: { data: { url: 'Screenshot upload failed' } } });
        }
        return Promise.reject(error);
    }
);

async function createTestRun(name: string): Promise<number> {
    const response = await axios.post(
        `${TESTRAIL_HOST}/index.php?/api/v2/add_run/${TESTRAIL_PROJECT_ID}`,
        {
            suite_id: TESTRAIL_SUITE_ID,
            name: name,
            include_all: true,
        },
        {
            auth: {
                username: TESTRAIL_USER!,
                password: TESTRAIL_API_KEY!,
            },
        }
    );
    return response.data.id;
}

async function addResultForCase(
    runId: number,
    caseId: number,
    statusId: number,
    comment: string
) {
    await axios.post(
        `${TESTRAIL_HOST}/index.php?/api/v2/add_result_for_case/${runId}/${caseId}`,
        {
            status_id: statusId,
            comment: comment,
        },
        {
            auth: {
                username: TESTRAIL_USER!,
                password: TESTRAIL_API_KEY!,
            },
        }
    );
}

async function getScreenshotURL(testTitle: string, screenshotName: string): Promise<string> {
    const screenshotPath = path.join(process.cwd(), 'screenshots', screenshotName);
    const runningInJenkins = !!JENKINS_BASE_URL;

    if (runningInJenkins && BUILD_NUMBER) {
        return `${jenkinsBaseUrl}/job/playwright-demo-framework/${BUILD_NUMBER}/artifact/screenshots/${screenshotName}`;
    } else {
        const publicLink = await uploadToImgBB(screenshotPath);
        return publicLink && publicLink !== 'Screenshot upload failed'
            ? publicLink
            : `./screenshots/${screenshotName}`;
    }
}

(async () => {
    const runName = `Automated Run - ${new Date().toLocaleString()}`;
    const runId = await createTestRun(runName);
    let hasFailures = false;

    for (const suite of reportData.suites) {
        for (const spec of suite.specs) {
            for (const test of spec.tests) {
                const title = test.title.join(' > ');
                const caseIdMatch = title.match(/@C(\d+)/);
                if (!caseIdMatch) continue;

                const caseId = parseInt(caseIdMatch[1], 10);
                const passed = test.outcome.verdict === 'expected';
                const status = passed ? 1 : 5;
                const statusText = passed ? 'PASSED' : 'FAILED';
                if (!passed) hasFailures = true;

                let comment = `Automated result for: ${title}`;
                if (!passed && test.error) {
                    comment += `\n\n❌ Error:\n${test.error}`;
                }

                const screenshotName = getLatestScreenshotForTitle(title);
                if (screenshotName) {
                    const url = await getScreenshotURL(title, screenshotName);
                    comment += `\n\n🖼️ Screenshot: ${url}`;
                }

                console.log(`    Test: ${title} → ${statusText}`);
                await addResultForCase(runId, caseId, status, comment);
            }
        }
    }

    console.log(`✅ Results uploaded to TestRail (Test Run ID: ${runId})`);

    if (hasFailures) {
        console.error('❌ Some tests failed.');
        process.exit(1);
    }
})();
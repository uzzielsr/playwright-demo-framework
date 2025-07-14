# Playwright Demo Framework

Enterprise-grade end-to-end automation framework using Playwright + TypeScript, with integration to TestRail and Testmo, and CI/CD via GitHub Actions, CircleCI, and Jenkins.

---

## Tech Stack

- Playwright
- TypeScript
- Page Object Model (POM)
- Tracing (for debugging failures)
- Automatic screenshots and videos
- TestRail integration
- GitHub Actions for CI/CD
- Selector constants via TypeScript modules

---

## Application Under Test

Magento Demo E-commerce site:

<https://magento.softwaretestingboard.com/>

---

## Project Structure

```bash
playwright-demo-framework/
│
├── .circleci/
│   └── config.yml                 # CircleCI pipeline config
│
├── .github/
│   └── workflows/
│       └── main.yml              # GitHub Actions workflow for CI/CD
│
├── src/
│   ├── constants/
│   │   └── selectors/
│   │       └── login.selectors.ts  # Centralized selectors for login page
│   ├── pages/
│   │   └── login.page.ts           # Page Object Model for login
│   └── tests/
│       └── login.spec.ts           # Playwright test specs
│
├── .env                            # Environment variables (not versioned)
├── .env.example                    # Example environment variables file
├── .gitignore                      # Git ignore rules
├── package.json                    # Project dependencies and scripts
├── package-lock.json               # NPM lock file
├── playwright.config.ts            # Playwright configuration
├── README.md                       # Project documentation
├── testrail.config.js              # TestRail integration config
└── tsconfig.json                   # TypeScript configuration
```

---

## System Prerequisites

- Node.js >= v20.x
- NPM
- Git

---

## Initial Setup

```bash
git clone https://github.com/<your-github-username>/playwright-demo-framework.git
cd playwright-demo-framework
npm install
npx playwright install --with-deps
```

---

## How to Run the Tests

### Run all tests and report to TestRail

```bash
npm run test:with-report
```

### Run tests in headed mode (browser visible)

```bash
npm run test:headed:with-report
```

---

## 🧪 How to Create a New Test

To add a new test using the Page Object Model structure, follow the steps below:

### 1. Create Selectors

Create a new file under `src/constants/selectors/`, for example:

```ts
// src/constants/selectors/account.selectors.ts
export const accountSelectors = {
  header: 'h1.account-title',
  logoutButton: '#logout'
};
```

> Use semantic and descriptive names.

---

### 2. Create the Page Object

Create a corresponding class in `src/pages/`:

```ts
// src/pages/account.page.ts
import { Page } from '@playwright/test';
import { accountSelectors } from '../constants/selectors/account.selectors';

export class AccountPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto(`${process.env.BASE_URL}/account`);
  }

  async logout() {
    await this.page.click(accountSelectors.logoutButton);
  }

  async isHeaderVisible() {
    return this.page.isVisible(accountSelectors.header);
  }
}
```

---

### 3. Create the Test File

Inside `src/tests/`, create the test spec file:

```ts
// src/tests/account.spec.ts
import { test, expect } from '@playwright/test';
import { AccountPage } from '../pages/account.page';

test('User can access account page', async ({ page }) => {
  const accountPage = new AccountPage(page);
  await accountPage.goto();
  const headerVisible = await accountPage.isHeaderVisible();
  expect(headerVisible).toBeTruthy();
});
```

If you're using TestRail:

```ts
// testrail-case-id: 1234
```

---

### 4. Run the Test

```bash
npm run test:with-report
```

This will:

- Launch tests
- Report results to TestRail
- Save videos, screenshots, and reports to `/test-results/`

---

### 5. Define Required Environment Variables

Ensure your `.env` file includes:

```env
BASE_URL=https://your-url.com
TEST_EMAIL=your_email@example.com
TEST_PASSWORD=your_password
INVALID_EMAIL=invalid@example.com
INVALID_PASSWORD=wrongpassword
```

These variables are automatically injected in CI pipelines via GitHub, CircleCI, or Jenkins.

---

## Output Artifacts

- **Screenshots and videos:** `/test-results/`
- **HTML report:** `/playwright-report/`

---

## Environment Configuration

Create a `.env` file in the project root with the following variables:

```bash
TESTRAIL_HOST=
TESTRAIL_USER=
TESTRAIL_PASSWORD=
TESTRAIL_PROJECT_ID=
TESTRAIL_SUITE_ID=

TESTMO_URL=
TESTMO_TOKEN=
TESTMO_PROJECT_ID=

BASE_URL=
TEST_EMAIL=
TEST_PASSWORD=
INVALID_EMAIL=
INVALID_PASSWORD=
```

These are automatically set in CI via GitHub secrets.

---

## TestRail Integration

- Test results are automatically reported to TestRail using the credentials and IDs from your `.env` file.
- Make sure your TestRail project and suite IDs are correct.
- All TestRail credentials should be provided via environment variables such as `$TESTRAIL_USER`, `$TESTRAIL_PASSWORD`, etc.

> 🔐 Do not hardcode credentials. Use environment variables or secrets.

---

## Testmo Integration

This project also supports reporting test results to **Testmo**, a modern test management platform.

### ✅ Requirements

- A Testmo account and an active project
- The official CLI reporter: `@testmo/testmo-cli`
- Set the following environment variables (locally or in CI):

```env
TESTMO_URL=https://your-team.testmo.net
TESTMO_TOKEN=your_testmo_api_token
TESTMO_PROJECT_ID=your_testmo_project_id
```

> 🔐 Never commit these credentials to source control. Use `.env` for local development and GitHub Secrets in CI.

---

### 🧪 How to Tag Tests for Testmo

To link Playwright tests with Testmo case IDs, tag your tests using the `@C<id>` annotation, for example:

```ts
test('@C1234 Login works with valid credentials', async ({ page }) => {
  // your test logic here
});
```

---

### 🚀 How to Run with Testmo Reporting

Run the tests and automatically submit results to Testmo using the script:

```bash
npm run test:with-report
```

This will:

- Run all Playwright tests
- Collect results via JUnit XML
- Submit results to Testmo via the CLI
- Upload screenshots and videos as attachments

Make sure your `test:with-report` script in `package.json` looks like this:

```json
"test:with-report": "playwright test; dotenv -- npx testmo automation:run:submit --instance $TESTMO_URL --project-id $TESTMO_PROJECT_ID --name 'Playwright Run' --source playwright --results test-results/results.xml"
```

---

### 🛠️ Debugging Testmo Integration

Use the `--debug` flag with the `testmo` CLI to see verbose logs:

```bash
npx testmo automation:run:submit --debug ...
```

You can also inspect the generated results file (`test-results/results.xml`) to ensure your test case annotations (`@C1234`) are being captured correctly.

---

## CI/CD with GitHub Actions

- The main workflow (`.github/workflows/main.yml`) installs dependencies, browsers, sets environment variables, runs tests, and uploads artifacts on every pull request and daily at 11:00 UTC.
- Test results and reports are uploaded as artifacts.

---

## CI/CD with CircleCI

1. Ensure you have the `.circleci/config.yml` file (included in this repo).
2. In CircleCI → Project Settings → Environment Variables, define the following secrets:
   - `TESTRAIL_HOST`
   - `TESTRAIL_USER`
   - `TESTRAIL_PASSWORD`
   - `TESTRAIL_PROJECT_ID`
   - `TESTRAIL_SUITE_ID`

   - `TESTMO_URL`
   - `TESTMO_TOKEN`
   - `TESTMO_PROJECT_ID`

   - `BASE_URL`
   - `TEST_EMAIL`
   - `TEST_PASSWORD`
   - `INVALID_EMAIL`
   - `INVALID_PASSWORD`
3. Push your code to GitHub.
4. Go to [https://circleci.com](https://circleci.com) and connect your GitHub project.
5. The pipeline will trigger automatically on each commit to branches like `main` if `.circleci/config.yml` is present.

Artifacts like screenshots, videos, and reports are stored in CircleCI after test runs.

---

## 🔧 Jenkins CI/CD Setup with GitHub Webhook + Ngrok + TestRail Integration

This project also supports executing tests through Jenkins using GitHub webhooks and optional ngrok tunneling for local development.

### 🖥️ 1. Jenkins Build Script

Inside Jenkins → your project → **Configure** → **Build** → **Execute Shell**, add the following script (with your real credentials set as Jenkins environment variables or injected via secrets):

```bash
#!/bin/bash

# ✅ Load NVM and use correct Node version
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm use 22

# ✅ TestRail + Jenkins config (inject via Jenkins credentials or environment variables)
export TESTRAIL_HOST="$TESTRAIL_HOST"
export TESTRAIL_USER="$TESTRAIL_USER"
export TESTRAIL_PASSWORD="$TESTRAIL_PASSWORD"
export TESTRAIL_PROJECT_ID="$TESTRAIL_PROJECT_ID"
export TESTRAIL_SUITE_ID="$TESTRAIL_SUITE_ID"

export TESTMO_URL="$TESTMO_URL"
export TESTMO_TOKEN="$TESTMO_TOKEN"
export TESTMO_PROJECT_ID="$TESTMO_PROJECT_ID"

export BASE_URL="$BASE_URL"
export TEST_EMAIL="$TEST_EMAIL"
export TEST_PASSWORD="$TEST_PASSWORD"
export INVALID_EMAIL="$INVALID_EMAIL"
export INVALID_PASSWORD="$INVALID_PASSWORD"

# ✅ Clean & install
rm -rf node_modules
npm install
npm run install:browsers

# ✅ Run tests with TestRail reporter
npm run test:with-report
```

> 🔐 Do not hardcode credentials. Use environment variables, Jenkins credentials plugin, or secrets injection.

---

### 🌐 2. Ngrok Tunnel (Optional for Local Jenkins)

If Jenkins is running locally (e.g., `http://localhost:9090`), use [ngrok](https://ngrok.com/) to expose it:

```bash
ngrok http 9090
```

Use the generated HTTPS forwarding URL as your webhook target in GitHub.

---

### 🔔 3. GitHub Webhook Setup

1. Go to **Settings → Webhooks → Add Webhook** in your GitHub repo.
2. Use the following settings:
   - **Payload URL**: `https://<ngrok-forwarding-url>/github-webhook/`
   - **Content type**: `application/json`
   - **Event**: Just the `push` event (or customize)
3. Ensure Jenkins is listening to GitHub events via:
   - **Build Triggers** → Check `GitHub hook trigger for GITScm polling`

---

### 📦 4. Jenkins Artifacts (Optional)

To archive test results (screenshots, videos, and reports):

1. In Jenkins → Project → **Configure** → **Post-build Actions**
2. Add **"Archive the artifacts"**
3. Set path:

```bash
test-results/**/*.*
```

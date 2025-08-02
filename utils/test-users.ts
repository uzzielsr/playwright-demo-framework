export function generateTestUser() {
    const baseUrl = process.env.BASE_URL!;
    const random = Math.floor(Math.random() * 100000);
    const timestamp = Date.now();
    const emailDomain = process.env.TEST_EMAIL_DOMAIN!;
    const password = process.env.TEST_PASSWORD!;
    const firstname = process.env.TEST_FIRST_NAME!;
    const lastname = process.env.TEST_LAST_NAME!;
    const testEmail = process.env.TEST_EMAIL!;
    const testEmailDomain = process.env.TEST_EMAIL_DOMAIN!;
    const adminUsername = process.env.ADMIN_USERNAME!;
    const adminPassword = process.env.ADMIN_PASSWORD!;
    const magentoPublicKey = process.env.MAGENTO_PUBLIC_KEY!;
    const magentoPrivateKey = process.env.MAGENTO_PRIVATE_KEY!;
    const magentoWebsiteId = process.env.MAGENTO_WEBSITE_ID!;
    const magentoStoreId = process.env.MAGENTO_STORE_ID!;
    const magentoGroupId = process.env.MAGENTO_GROUP_ID!;
    const invalidEmail = process.env.INVALID_EMAIL!;
    const invalidPassword = process.env.INVALID_PASSWORD!;
    const testrailHost = process.env.TESTRAIL_HOST!;
    const testrailUser = process.env.TESTRAIL_USER!;
    const testrailPassword = process.env.TESTRAIL_PASSWORD!;
    const testrailProjectId = process.env.TESTRAIL_PROJECT_ID!;
    const testrailSuiteId = process.env.TESTRAIL_SUITE_ID!;
    const testmoUrl = process.env.TESTMO_URL!;
    const testmoToken = process.env.TESTMO_TOKEN!;
    const testmoProjectId = process.env.TESTMO_PROJECT_ID!;

    return {
        baseUrl,
        email: `test.${timestamp}.${random}@${emailDomain}`,
        firstname,
        lastname,
        password,
        testEmail,
        testEmailDomain,
        adminUsername,
        adminPassword,
        magentoPublicKey,
        magentoPrivateKey,
        magentoWebsiteId,
        magentoStoreId,
        magentoGroupId,
        invalidEmail,
        invalidPassword,
        testrailHost,
        testrailUser,
        testrailPassword,
        testrailProjectId,
        testrailSuiteId,
        testmoUrl,
        testmoToken,
        testmoProjectId
    };
}
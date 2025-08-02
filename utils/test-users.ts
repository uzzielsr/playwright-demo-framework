export function generateTestUser() {
    const random = Math.floor(Math.random() * 100000);
    const timestamp = Date.now();
    const emailDomain = process.env.TEST_EMAIL_DOMAIN;
    const password = process.env.TEST_PASSWORD;
    const firstname = process.env.TEST_FIRST_NAME;
    const lastname = process.env.TEST_LAST_NAME;

    if (!emailDomain || !password || !firstname || !lastname) {
        throw new Error('❌ Missing required environment variables: TEST_EMAIL_DOMAIN, TEST_PASSWORD, TEST_FIRST_NAME, TEST_LAST_NAME');
    }

    return {
        email: `test.${timestamp}.${random}@${emailDomain}`,
        firstname,
        lastname,
        password
    };
}
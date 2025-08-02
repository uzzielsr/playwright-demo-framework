export const LoginSelectors = {
    loginLink: 'a[href*="customer/account/login"]',
    usernameField: '[name="login[username]"]',
    passwordField: '[name="login[password]"]',
    submitButton: 'button#send2',
    homeTitle: 'h1.page-title span.base:has-text("Home Page")',
    loggedInIndicator: '.header span.logged-in:has-text("Welcome,")',
    loginErrorMessage: 'div.message-error div:has-text("The account sign-in was incorrect or your account is disabled temporarily.")',
};
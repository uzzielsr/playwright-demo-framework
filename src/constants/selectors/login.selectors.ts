export const LoginSelectors = {
    loginLink: 'a[href*="customer/account/login"]',
    usernameField: '[name="login[username]"]',
    passwordField: '[name="login[password]"]',
    submitButton: 'button#send2.action.login.primary[name="send"]:has-text("Sign In")',
    homeTitle: 'h1.page-title span.base:has-text("Home Page")',
    loggedInIndicator: 'span:has-text("Welcome,"), .header span:has-text("Welcome,"), .welcome:has-text("Welcome,"), [class*="welcome"]:has-text("Welcome,")',
    loginErrorMessage: 'div.message-error',
};
import { Page, expect } from '@playwright/test';
import { LoginSelectors } from '../constants/selectors/login.selectors';

export class LoginPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        const baseUrl = process.env.BASE_URL;
        if (!baseUrl) {
            throw new Error('BASE_URL is not defined in the .env file.');
        }
        const cleanBaseUrl = baseUrl.replace(/\/$/, '');
        await this.page.goto(`${cleanBaseUrl}/customer/account/login`);
        await this.page.waitForLoadState('load');
    }

    async login(email: string, password: string) {
        await this.page.fill(LoginSelectors.usernameField, email);
        await this.page.fill(LoginSelectors.passwordField, password);
        await this.page.locator(LoginSelectors.submitButton).click();
    }

    async isUserLoggedIn(username: string) {
        await Promise.race([
            expect(this.page.locator(LoginSelectors.loggedInIndicator).first()).toContainText(`Welcome, ${username}`, { timeout: 10000 }),
            expect(this.page).toHaveURL(/.*customer\/account.*/, { timeout: 10000 }),
            expect(this.page.locator('body')).toContainText(`Welcome, ${username}`, { timeout: 10000 })
        ]);
    }

    async isErrorDisplayed() {
        await Promise.race([
            expect(this.page.locator(LoginSelectors.loginErrorMessage)).toContainText("sign-in was incorrect", { timeout: 10000 }),
            expect(this.page.locator(LoginSelectors.loginErrorMessage)).toContainText("Invalid Form Key", { timeout: 10000 }),
            expect(this.page.locator(LoginSelectors.loginErrorMessage)).toContainText("invalid", { timeout: 10000 })
        ]);
    }
}
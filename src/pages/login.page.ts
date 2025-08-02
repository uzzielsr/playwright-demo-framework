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
        await this.page.goto(`${baseUrl}`);
        await this.page.waitForLoadState('load');
        await this.page.click(LoginSelectors.loginLink);
        await this.page.waitForLoadState('load');
    }

    async login(email: string, password: string) {
        await this.page.fill(LoginSelectors.usernameField, email);
        await this.page.fill(LoginSelectors.passwordField, password);
        await this.page.click(LoginSelectors.submitButton);
        await this.page.waitForLoadState('load');
    }

    async isUserLoggedIn(username: string) {
        await expect(this.page.locator(LoginSelectors.loggedInIndicator).first()).toContainText(`Welcome, ${username}`);
    }

    async isErrorDisplayed() {
        await expect(this.page.locator(LoginSelectors.loginErrorMessage)).toContainText("The account sign-in was incorrect or your account is disabled temporarily.");
    }
}
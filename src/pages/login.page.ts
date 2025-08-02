import { Page, expect } from '@playwright/test';
import { loginLocators } from '../../locators/login/index';

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
        await this.page.fill(loginLocators.usernameField, email);
        await this.page.fill(loginLocators.passwordField, password);
        await this.page.locator(loginLocators.submitButton).click();
    }

    async isUserLoggedIn(username: string) {
        await Promise.race([
            expect(this.page.locator(loginLocators.loggedInIndicator).first()).toContainText(`Welcome, ${username}`, { timeout: 10000 }),
            expect(this.page).toHaveURL(/.*customer\/account.*/, { timeout: 10000 }),
            expect(this.page.locator('body')).toContainText(`Welcome, ${username}`, { timeout: 10000 })
        ]);
    }

    async isErrorDisplayed() {
        await Promise.race([
            expect(this.page).toHaveURL(/.*customer\/account\/login.*/, { timeout: 10000 }),
            expect(this.page.locator(loginLocators.usernameField)).toBeVisible({ timeout: 10000 }),
            expect(this.page.locator(loginLocators.passwordField)).toBeVisible({ timeout: 10000 }),
            expect(this.page.locator('body')).toContainText('The account sign-in was incorrect or your account is disabled temporarily. Please wait and try again later.', { timeout: 10000 }),
            expect(this.page.locator('body')).toContainText('Invalid Form Key. Please refresh the page.', { timeout: 10000 }),
            expect(this.page.locator('body')).toContainText('You did not sign in correctly or your account is temporarily disabled.', { timeout: 10000 })
        ]);
    }
}
import { Page } from '@playwright/test';
import { LoginSelectors } from '../constants/selectors/login.selectors';

export class LoginPage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async navigate() {
        const baseUrl = process.env.BASE_URL;
        if (!baseUrl) {
            throw new Error('❌ BASE_URL is not defined in the .env file.');
        }

        await this.page.goto(baseUrl, { waitUntil: 'load', timeout: 90000 });
        await this.page.waitForLoadState('networkidle', { timeout: 30000 });
        await this.page.click(LoginSelectors.loginLink, { timeout: 15000 });
    }

    async login(email: string, password: string) {
        await this.page.fill(LoginSelectors.usernameField, email);
        await this.page.fill(LoginSelectors.passwordField, password);
        await this.page.click(LoginSelectors.submitButton);

        try {
            await Promise.race([
                this.page.waitForURL(url => !url.toString().includes('/customer/account/login'), { timeout: 15000 }),
                this.page.waitForSelector('.message-error', { timeout: 15000 })
            ]);
        } catch {
            await this.page.waitForTimeout(3000);
        }

        await this.page.waitForLoadState('networkidle', { timeout: 10000 });
    }

    async isUserLoggedIn(): Promise<boolean> {
        try {
            await this.page.waitForLoadState('load', { timeout: 30000 });

            const currentUrl = this.page.url();
            const isOnHomepage = !currentUrl.includes('/customer/account/login');

            if (isOnHomepage) {
                await this.page.waitForSelector('h1:has-text("Home Page")', { timeout: 10000 });
                return true;
            }

            return false;
        } catch {
            return false;
        }
    }

    async isErrorDisplayed(): Promise<boolean> {
        try {
            await this.page.waitForLoadState('load', { timeout: 30000 });
            await this.page.waitForSelector(LoginSelectors.errorMessage, { timeout: 15000 });
            return true;
        } catch {
            return false;
        }
    }
}
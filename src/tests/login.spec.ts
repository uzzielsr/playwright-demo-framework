import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test.describe('Login functionality', () => {
  test('Successful login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.loginWithValidCredentials();
    const isLoggedIn = await loginPage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();
  });
});
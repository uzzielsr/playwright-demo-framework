import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test.describe('Login functionality', () => {
  
  test('@C2333 Successful login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.loginWithValidCredentials();
    const isLoggedIn = await loginPage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();
  });

  test('@C2334 Login with invalid password', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.loginWithInvalidCredentials();
    const isVisible = await loginPage.isErrorDisplayed();
    expect(isVisible).toBeTruthy();
  });

});
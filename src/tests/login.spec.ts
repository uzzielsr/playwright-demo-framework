import { test, expect, request } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { UserApi } from '../../api/user.api';
import { generateTestUser } from '../../utils/test-users';

test.describe('Login functionality', () => {
  let userApi: UserApi;
  let loginPage: LoginPage;
  let user: ReturnType<typeof generateTestUser>;
  let createdUser: any;

  test.beforeEach(async ({ page }) => {
    const requestContext = await request.newContext({
      ignoreHTTPSErrors: true
    });
    userApi = new UserApi(requestContext, process.env.BASE_URL!);
    loginPage = new LoginPage(page);
    user = generateTestUser();

    createdUser = await userApi.createUser(user);

    await loginPage.navigate();
  });

  test.afterEach(async () => {
    if (createdUser?.id) {
      try {
        await userApi.deleteUser(createdUser.id);
      } catch (error) {
        // Silent cleanup failure
      }
    }
  });

  test('@C2333 Successful login with API-created user', async ({ page }) => {
    await loginPage.login(user.email, user.password);

    const isLoggedIn = await loginPage.isUserLoggedIn();
    expect(isLoggedIn).toBeTruthy();
  });

  test('@C2334 Login with invalid password', async ({ page }) => {
    await loginPage.login(user.email, 'WrongPassword123!');

    const isVisible = await loginPage.isErrorDisplayed();
    expect(isVisible).toBeTruthy();
  });

});
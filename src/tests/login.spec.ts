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
    await userApi.deleteUser(createdUser?.id);
  });

  test('@C2333 Successful login with API-created user', async ({ page }) => {
    await loginPage.login(user.email, user.password);
    await loginPage.isUserLoggedIn(`${user.firstname} ${user.lastname}`);
  });

  test('@C2334 Login with invalid password', async ({ page }) => {
    await loginPage.login(user.email, user.invalidPassword);
    await loginPage.isErrorDisplayed();
  });

});
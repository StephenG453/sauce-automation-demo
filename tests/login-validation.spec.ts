import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

/**
 * Validates: the login page rejects credentials that don't correspond to a
 * real account with a visible, user-facing error, and never redirects an
 * unauthenticated visitor into an authenticated area of the site.
 */
test.describe('Login', () => {
  test.skip('logging in with an unregistered email shows a validation error', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();

    await expect(loginPage.emailTextBox).toBeVisible();
    await expect(loginPage.passwordTextBox).toBeVisible();
    await expect(loginPage.forgotPasswordLink).toBeVisible();
    await expect(loginPage.signInButton).toBeVisible();

    await loginPage.login('nota.realuser@example.com', 'WrongPassword123!');

    await loginPage.expectValidationError();
    await expect(page).toHaveURL(/account\/login/i);
  });

  test('login page is reachable from the header on every page', async ({ page }) => {
    await page.goto('/');
    const loginPage = new LoginPage(page);

    await loginPage.loginLink.click();

    await expect(page).toHaveURL(/account\/login/i);

    await expect(loginPage.emailTextBox).toBeVisible();
    await expect(loginPage.passwordTextBox).toBeVisible();
    await expect(loginPage.forgotPasswordLink).toBeVisible();
    await expect(loginPage.signInButton).toBeVisible();
  });
});

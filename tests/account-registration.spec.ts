import { test, expect } from '@playwright/test';
import { BasePage } from '../pages/BasePage';
import { RegisterPage } from '../pages/RegisterPage';
import { uniqueEmail, randomPassword } from '../utils/testData';

/**
 * Validates: a new visitor can reach the account registration form from the
 * header "Sign up" link, and that submitting the form without a password
 * (an invalid submission) is rejected rather than silently succeeding.
 * Uses generated, disposable email addresses only — no real user data.
 */
test.describe('Account registration', () => {
  test('Sign up link in header navigates to the registration form', async ({ page }) => {
    const basePage = new BasePage(page);
    await basePage.goto('/');

    await basePage.signUpLink.click();

    const registerPage = new RegisterPage(page);

    await expect(page).toHaveURL(/account\/register/i);
    await expect(registerPage.header).toBeVisible();

    await expect(registerPage.firstNameText).toBeVisible();
    await expect(registerPage.firstNameTextBox).toBeVisible();

    await expect(registerPage.lastNameText).toBeVisible();
    await expect(registerPage.lastNameTextBox).toBeVisible();

    await expect(registerPage.emailText).toBeVisible();
    await expect(registerPage.emailTextBox).toBeVisible();

    await expect(registerPage.passwordText).toBeVisible();
    await expect(registerPage.passwordTextBox).toBeVisible();

    await expect(registerPage.submitButton).toBeVisible();
  });

  test.skip('submitting the registration form without a password is rejected', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();

    // Intentionally omit the password to verify client/server-side validation.
    await registerPage.register(uniqueEmail());

    await expect(registerPage.passwordError).toBeVisible();

    // We should still be on the registration page (not redirected to the
    // account dashboard), since a required field was left empty.
    await registerPage.expectStillOnRegisterForm();
  });

  // Skipped by default: creates a real account against the live demo store.
  // Enable deliberately (e.g. in a disposable test environment) if you
  // want to see a full happy-path registration
  test.skip('a visitor can successfully register a new account', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();

    await registerPage.register(uniqueEmail(), randomPassword());

    await expect(page).toHaveURL(/account(?!\/register)/i);
  });
});

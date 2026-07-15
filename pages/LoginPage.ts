import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Represents the /account/login page.
 */
export class LoginPage extends BasePage {
  readonly emailTextBox: Locator;
  readonly passwordTextBox: Locator;
  readonly forgotPasswordLink: Locator;

  readonly signInButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.emailTextBox = page.locator('#customer_email, input[name="customer[email]"], input[type="email"]').first();
    this.passwordTextBox = page.locator('#customer_password, input[name="customer[password]"], input[type="password"]').first();
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot your password?' })

    this.signInButton = page.getByRole('button', { name: /sign in|log in/i });
    this.errorMessage = page.locator('.error, [class*="error"], [role="alert"]').first();
  }

  async goto() {
    await super.goto('/account/login');
  }

  async login(email: string, password: string) {
    await this.emailTextBox.fill(email);
    await this.passwordTextBox.fill(password);
    await this.signInButton.click();
  }

  async expectValidationError() {
    await expect(this.errorMessage).toBeVisible();
  }
}

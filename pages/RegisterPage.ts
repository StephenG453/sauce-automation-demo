import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Represents the /account/register page.
 */
export class RegisterPage extends BasePage {
    readonly header: Locator;

    readonly firstNameText: Locator;
    readonly firstNameTextBox: Locator;

    readonly lastNameText: Locator;
    readonly lastNameTextBox: Locator;

    readonly emailText: Locator;
    readonly emailTextBox: Locator;

    readonly passwordText: Locator;
    readonly passwordTextBox: Locator;

    readonly submitButton: Locator;

    readonly passwordError: Locator;

  constructor(page: Page) {
    super(page);
    this.header = page.getByRole('heading', { name: 'Create Account' });

    this.firstNameText = page.getByText('First Name');
    this.firstNameTextBox = page.locator('input[name="customer[first_name]"]');

    this.lastNameText = page.getByText('Last Name');
    this.lastNameTextBox = page.locator('input[name="customer[last_name]"]');

    this.emailText = page.getByText('Email Address');
    this.emailTextBox = page.locator('input[name="customer[email]"]');

    this.passwordText = page.getByText('Password');
    this.passwordTextBox = page.locator('input[name="customer[password]"]');

    this.passwordError = page.getByText("Password can't be blank.");

    // Password inputs have no corresponding ARIA role (per the HTML-AAM spec),
    // so getByRole can't target them — getByLabel is the closest role-based
    // equivalent (it still resolves via the accessible name, not raw CSS).
    this.submitButton = page.getByRole('button', { name: 'Create' });
  }

  async goto() {
    await super.goto('/account/register');
  }

  async register(email: string, password?: string) {
    await this.emailTextBox.fill(email);
    if (password) {
      await this.passwordTextBox.fill(password);
    }
    await this.submitButton.click();
  }

  async expectStillOnRegisterForm() {
    await expect(this.page).toHaveURL(/account\/register/i);
  }
}

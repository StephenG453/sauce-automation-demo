import { Page, Locator } from '@playwright/test';

/**
 * BasePage holds locators and actions common to every page on the site
 * (the header: search, login/signup links, and the mini-cart icon).
 * Concrete page objects extend this so shared header assertions/actions
 * don't need to be duplicated in every spec.
 */
export class BasePage {
  readonly page: Page;
  readonly searchLink: Locator;
  readonly loginLink: Locator;
  readonly signUpLink: Locator;
  readonly cartLink: Locator;
  readonly cartCount: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchLink = page.getByRole('link', { name: 'Search', exact: true }).first();
    this.loginLink = page.getByRole('link', { name: /log in/i });
    this.signUpLink = page.getByRole('link', { name: /sign up/i });
    this.cartLink = page.getByRole('link', { name: /my cart/i }).first();
    this.cartCount = page.locator('text=/My Cart \\(\\d+\\)/').first();
  }

  async goto(path = '/') {
    await this.page.goto(path);
  }

  /** Reads the item count shown in the "My Cart (N)" header link. */
  async getCartCount(): Promise<number> {
    const text = await this.cartCount.textContent();
    const match = text?.match(/\((\d+)\)/);
    return match ? parseInt(match[1], 10) : 0;
  }

  async openCart() {
    await this.cartLink.click();
  }
}

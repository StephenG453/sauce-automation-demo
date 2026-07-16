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

  /**
   * Reads the item count shown in the "My Cart (N)" header link. Throws
   * with the actual text found instead of silently falling back to 0, so a
   * broken/renamed cart-count element fails loudly with its real cause
   * rather than surfacing later as a confusing "count didn't change".
   */
  async getCartCount(): Promise<number> {
    const text = await this.cartCount.textContent();
    const match = text?.match(/\((\d+)\)/);
    if (!match) {
      throw new Error(`getCartCount: expected cart count text to match "My Cart (N)", got "${text}"`);
    }
    return parseInt(match[1], 10);
  }

  async openCart() {
    await this.cartLink.click();
  }
}

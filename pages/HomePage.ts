import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Represents the storefront homepage — the frontpage product grid
 * (Grey jacket, Noir jacket, Striped top) and top-level nav menu.
 */
export class HomePage extends BasePage {
  readonly productCards: Locator;
  readonly menuButton: Locator;

  constructor(page: Page) {
    super(page);
    this.productCards = page.locator('a', { hasText: '£' });
    this.menuButton = page.getByRole('link', { name: 'Menu' });
  }

  async goto() {
    await super.goto('/');
  }

  /** Returns the locator for a single product card by its visible name, e.g. "Grey jacket". */
  productCardByName(name: string): Locator {
    return this.page.getByRole('link', { name: new RegExp(name, 'i') }).first();
  }

  async openProduct(name: string) {
    await this.productCardByName(name).click();
  }

  async expectLoaded() {
    await expect(this.page).toHaveTitle(/Sauce Demo/i);
    await expect(this.page.getByRole('heading', { name: 'Sauce Demo' })).toBeVisible();
  }
}

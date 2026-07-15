import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Represents the /cart page: line items, quantity updates, removal, and checkout entry point.
 */
export class CartPage extends BasePage {
  readonly checkoutButton: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    super(page);

      this.checkoutButton = page.getByRole('button', { name: /check ?out/i }).or(
      page.getByRole('link', { name: /check ?out/i })
    );
    this.emptyCartMessage = page.getByText(/your cart is empty/i);
  }

  async goto() {
    await super.goto('/cart');
  }

    lineItemByName(name: string): Locator {
        return this.page.locator('div.row').filter({
            has: this.page.getByRole('link', { name: new RegExp(name, 'i') }),
        });
    }

    async removeItem(name: string) {
        const row = this.lineItemByName(name);
        // The remove control renders as a small "x", not text containing the
        // word "remove", so name-based role matching won't find it. `.remove`
        // is the one structural anchor available (no ARIA role/label on this
        // element in this theme) — it's the only interactive control in that
        // cell, so we click whatever link or button is inside it.
        const removeCell = row.locator('.remove');
        await removeCell.getByRole('link').or(removeCell.getByRole('button')).click();
    }

  async expectEmpty() {
    await expect(this.emptyCartMessage).toBeVisible();
  }

  async proceedToCheckout() {
    await this.checkoutButton.first().click();
  }
}

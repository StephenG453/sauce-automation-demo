import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Represents an individual product detail page, e.g. /products/grey-jacket.
 */
export class ProductPage extends BasePage {
  readonly productPrice: Locator;
  readonly quantityInput: Locator;
  readonly addToCartButton: Locator;
  readonly variantSelectors: Locator;

    constructor(page: Page) {
    super(page);

    this.productPrice = page.getByText(/£\d+\.\d{2}/).first();
    this.quantityInput = page.locator('input[type="number"], input[name="quantity"]').first();
    this.addToCartButton = page.getByRole('button', { name: 'Add to Cart' });

    // Native <select> elements map to the ARIA "combobox" role. Some
    // products (e.g. Grey jacket) have none; variant products (e.g. Noir
    // jacket, with Size/Color options) render one or more of these.
    this.variantSelectors = page.getByRole('combobox');
  }

  async gotoProduct(handle: string) {
    await super.goto(`/products/${handle}`);
  }

    /**
     * The site logo is also markup as an <h1> ("Sauce Demo"), so a plain
     * getByRole('heading', { level: 1 }) matches two elements and trips
     * strict mode. Filtering by the expected accessible name up front
     * disambiguates the product's h1 from the header's h1.
     */
    productHeading(name: string): Locator {
        return this.page.getByRole('heading', { level: 1, name: new RegExp(name, 'i') });
    }

    async expectProductName(name: string) {
        await expect(this.productHeading(name)).toBeVisible();
    }

  async setQuantity(qty: number) {
    if (await this.quantityInput.count()) {
      await this.quantityInput.fill(String(qty));
    }
  }

    /**
     * Explicitly selects a variant option in every dropdown on the page, if
     * any exist. The underlying <select> already defaults to its first
     * option, but Shopify's variant-picker JS typically only registers the
     * chosen variant once a change event fires — so on products like Noir
     * jacket (Size/Color), Add to Cart can silently no-op if nothing was
     * ever explicitly selected. No-ops on single-variant products like Grey
     * jacket, which render zero comboboxes.
     */
    async selectFirstAvailableVariant() {
        const count = await this.variantSelectors.count();
        for (let i = 0; i < count; i++) {
            await this.variantSelectors.nth(i).selectOption({ index: 0 });
        }
    }

    async addToCart() {
        await this.selectFirstAvailableVariant();
        await this.addToCartButton.click();
    }
}

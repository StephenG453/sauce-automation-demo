import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';

/**
 * Validates the core shopping flow:
 *  1. A product detail page renders the correct name/price for its handle.
 *  2. Adding a product to cart updates the header cart count.
 *  3. The cart page lists the item that was added.
 *  4. Removing the item empties the cart again.
 * This is the highest-value flow on an e-commerce storefront, so it is
 * covered end-to-end rather than only at the unit/page level.
 */
test.describe('Product detail and cart management', () => {
  // Hand-typed catalog data (product handle/name/price) — see README "Note
  // on scope" re: sourcing fixtures from the Storefront API instead, to
  // avoid drift as the catalog changes/grows.
  test('product detail page shows the correct name and price', async ({ page }) => {
    const productPage = new ProductPage(page);

    await productPage.gotoProduct('grey-jacket');

    await productPage.expectProductName('Grey jacket');
    await expect(productPage.productPrice).toContainText('£55.00');
    await expect(productPage.addToCartButton).toBeVisible();
  });

  // Hand-typed catalog data (product handle/name) — see README "Note on
  // scope" re: sourcing fixtures from the Storefront API instead, to avoid
  // drift as the catalog changes/grows.
  test('adding a product to the cart increments the header cart count', async ({ page }) => {
    const productPage = new ProductPage(page);
    await productPage.gotoProduct('grey-jacket');

    await productPage.expectProductName('Grey jacket');
    await expect(productPage.addToCartButton).toBeVisible();

    const before = await productPage.getCartCount();
    await productPage.addToCart();

    await expect.poll(async () => productPage.getCartCount(), {
        message: 'expected header cart count to increase after Add to Cart',
      })
      .toBeGreaterThan(before);
  });

  // Hand-typed catalog data (product handle/name) — see README "Note on
  // scope" re: sourcing fixtures from the Storefront API instead, to avoid
  // drift as the catalog changes/grows.
  test('an added item appears in the cart and can be removed', async ({ page }) => {
        const productPage = new ProductPage(page);
        await productPage.gotoProduct('noir-jacket');

        await productPage.expectProductName('Noir jacket');
        await expect(productPage.addToCartButton).toBeVisible();

        const before = await productPage.getCartCount();
        await productPage.addToCart();

        // Wait for the add-to-cart request to actually land before navigating —
        // otherwise /cart can render before the server-side cart is updated.
        await expect
            .poll(async () => productPage.getCartCount(), {
                message: 'expected header cart count to increase before navigating to /cart',
            })
            .toBeGreaterThan(before);

        const cart = new CartPage(page);
        await cart.goto();

        await expect(cart.lineItemByName('Noir jacket')).toBeVisible();

        await cart.removeItem('Noir jacket');
        await expect(cart.lineItemByName('Noir jacket')).toHaveCount(0);
    });
});

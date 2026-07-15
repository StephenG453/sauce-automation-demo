import { test, expect } from '@playwright/test';
import { HomePage } from '../pages/HomePage';

/**
 * Validates: the storefront homepage loads successfully, the header nav
 * (Search / Log In / Sign up / My Cart) is present, and the three frontpage
 * product cards render with a name and price. This is the smoke test that
 * should catch a broken deploy before any deeper flow is tested.
 */
test.describe('Homepage', () => {
  test('loads successfully with header nav and product grid', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await homePage.expectLoaded();

    await expect(homePage.searchLink).toBeVisible();
    await expect(homePage.loginLink).toBeVisible();
    await expect(homePage.signUpLink).toBeVisible();
    await expect(homePage.cartLink).toBeVisible();

    for (const product of ['Grey jacket', 'Noir jacket', 'Striped top']) {
      await expect(homePage.productCardByName(product)).toBeVisible();
    }
  });

  test('cart starts empty for a first-time visitor', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    expect(await homePage.getCartCount()).toBe(0);
  });

  test('clicking a product card navigates to that product detail page', async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.goto();

    await homePage.openProduct('Grey jacket');

    await expect(page).toHaveURL(/products\/grey-jacket/);
    await expect(page.getByRole('heading', { name: /grey jacket/i })).toBeVisible();
  });
});

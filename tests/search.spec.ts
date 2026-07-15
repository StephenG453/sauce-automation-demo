import { test, expect } from '@playwright/test';
import { SearchPage } from '../pages/SearchPage';
import * as sea from "node:sea";

/**
 * Validates: the storefront's on-site search returns the expected product
 * for a known query, and communicates clearly (no crash / blank page) when
 * a query matches nothing. Search is a common entry point for shoppers, so
 * regressions here directly affect discoverability/conversion.
 */
test.describe('Search', () => {
  // Hand-typed catalog data (assumes a "jacket" product exists) — see
  // README "Note on scope" re: sourcing fixtures from the Storefront API
  // instead, to avoid drift as the catalog changes/grows.
  test('searching a known product term returns that product', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.goto();

    await expect(searchPage.headerText).toBeVisible();

    await searchPage.searchFor('jacket');

    await expect(page).toHaveURL(/q=jacket/i);
    await searchPage.expectResultContaining('jacket');
  });

  // Hand-typed catalog data ("grey jacket" assumed to be a real product
  // name) — see README "Note on scope" re: sourcing fixtures from the
  // Storefront API instead, to avoid drift as the catalog changes/grows.
  test('searching a nonsense term does not error and shows no matching products', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.goto();

    await expect(searchPage.headerText).toBeVisible();

    const term = 'zzzznonexistentproductzzzz';
    await searchPage.searchFor(term);

    await expect(page).toHaveURL(new RegExp(`q=${term}`, 'i'));
    await expect(searchPage.noResultsMessage(term)).toBeVisible();

    // Regardless of exact copy, the three known frontpage products must NOT
    // appear on a search results page for a term that matches nothing.
    await expect(page.getByRole('link', { name: /grey jacket/i })).toHaveCount(0);
  });
});

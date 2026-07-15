import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

/**
 * Represents the /search results page.
 */
export class SearchPage extends BasePage {
  readonly headerText: Locator;

  readonly searchInput: Locator;
  readonly searchSubmit: Locator;
  readonly results: Locator;

  constructor(page: Page) {
    super(page);

    this.headerText = page.getByRole('heading', { name: 'Search Results' });
    this.searchInput = page.getByRole('searchbox').or(page.locator('input[type="search"], input[name="q"]')).first();
    this.searchSubmit = page.getByRole('button', { name: /search/i }).first();
    this.results = page.locator('a', { hasText: '£' });
  }

  async goto() {
    await super.goto('/search');
  }

  async searchFor(term: string) {
    await this.searchInput.fill(term);
    await this.searchInput.press('Enter');
  }

    /** Matches the site's "No results found for {term}" empty-state message. */
    noResultsMessage(term: string): Locator {
        return this.page.getByText(`No results found for ${term}`);
    }

  async expectResultContaining(name: string) {
    await expect(this.page.getByRole('link', { name: new RegExp(name, 'i') }).first()).toBeVisible();
  }
}

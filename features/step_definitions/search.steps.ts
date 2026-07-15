import { Given, When, Then } from '@cucumber/cucumber';
import { expect } from '@playwright/test';
import { CustomWorld } from '../support/world';
import { SearchPage } from '../../pages/SearchPage';

Given('I am on the search page', async function (this: CustomWorld) {
  this.searchPage = new SearchPage(this.page);
  await this.searchPage.goto();
  await expect(this.searchPage.headerText).toBeVisible();
});

When('I search for {string}', async function (this: CustomWorld, term: string) {
  await this.searchPage.searchFor(term);
});

Then('the results page URL should contain {string}', async function (this: CustomWorld, fragment: string) {
  await expect(this.page).toHaveURL(new RegExp(fragment, 'i'));
});

Then('a result containing {string} should be visible', async function (this: CustomWorld, name: string) {
  await this.searchPage.expectResultContaining(name);
});

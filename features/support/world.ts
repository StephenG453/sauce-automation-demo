import { setWorldConstructor, World, IWorldOptions } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from '@playwright/test';
import { SearchPage } from '../../pages/SearchPage';

/**
 * Custom Cucumber World: carries the Playwright browser/context/page and
 * the current page object across a scenario's steps.
 */
export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  searchPage!: SearchPage;

  constructor(options: IWorldOptions) {
    super(options);
  }
}

setWorldConstructor(CustomWorld);

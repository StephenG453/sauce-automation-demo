import { Before, After } from '@cucumber/cucumber';
import { chromium } from '@playwright/test';
import { CustomWorld } from './world';

/**
 * Mirrors the browser/baseURL setup Playwright Test does for us automatically
 * (see playwright.config.ts) — Cucumber has no equivalent, so it's done by hand
 * per scenario here.
 */
Before(async function (this: CustomWorld) {
  this.browser = await chromium.launch();
  this.context = await this.browser.newContext({
    baseURL: 'https://sauce-demo.myshopify.com',
  });
  this.page = await this.context.newPage();
});

After(async function (this: CustomWorld) {
  await this.context?.close();
  await this.browser?.close();
});

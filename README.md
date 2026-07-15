# Playwright + TypeScript Automation Sample

A self-contained UI test automation sample,
targeting the public Shopify demo storefront **https://sauce-demo.myshopify.com/**, written using the Page Object Model
design pattern for Typescript Playwright.

## Why this site

It's a small, publicly accessible e-commerce storefront with just enough
surface area, homepage, search, product pages, cart, login, registration, etc. 
to demonstrate a realistic test structure without needing a large app or
any credentials.

## Project structure

```
playwright-sauce-demo/
├── playwright.config.ts     # Base URL, browsers/devices, reporters, tracing
├── pages/                    # Page Object Model
│   ├── BasePage.ts           # Shared header: search / login / signup / cart
│   ├── HomePage.ts
│   ├── SearchPage.ts
│   ├── ProductPage.ts
│   ├── CartPage.ts
│   ├── LoginPage.ts
│   └── RegisterPage.ts
├── utils/
│   └── testData.ts           # Disposable email/password generators (no real PII)
├── tests/
│   ├── home.spec.ts
│   ├── search.spec.ts
│   ├── product-and-cart.spec.ts
│   ├── account-registration.spec.ts
│   └── login-validation.spec.ts
├── cucumber.js                # Cucumber config (see "BDD / Cucumber example" below)
└── features/                  # Gherkin/BDD example, reusing the same page objects
    ├── search.feature
    ├── step_definitions/
    │   └── search.steps.ts
    └── support/
        ├── world.ts
        └── hooks.ts
```

Each page object encapsulates the locators and interactions for one page/
component, so tests read as business-level steps and locator changes only
need to be updated in one place.

## Setup

```bash
npm install
npx playwright install --with-deps
```

## Running the tests

```bash
npx playwright test              # headless, all browsers defined in config
npx playwright test --headed     # watch it run
npx playwright test --ui         # interactive UI mode
npx playwright show-report       # open the last HTML report
```

Tests run against Chromium and Firefox by default. See `playwright.config.ts` to narrow that
down, e.g. `npx playwright test --project=chromium`.

## What each spec validates

| File | Scenario | What it proves                                                                                                                                                                                          |
|---|---|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `home.spec.ts` | Homepage load | Page loads, title/heading correct, header nav (Search/Log In/Sign up/Cart) is visible, and all three frontpage products render.                                                                         |
| | Cart starts empty | A first-time visitor's cart count reads 0.                                                                                                                                                              |
| | Product card navigation | Clicking a product card routes to the correct `/products/<handle>` page.                                                                                                                                |
| `search.spec.ts` | Search returns a known result | Searching "jacket" lands on a `?q=jacket` results page containing a matching product.                                                                                                                   |
| | Search with no matches | A nonsense query doesn't error and correctly excludes unrelated products from the results.                                                                                                              |
| `product-and-cart.spec.ts` | Product detail content | Grey jacket's product page shows the correct name and price (£55.00).                                                                                                                                   |
| | Add to cart | Adding a product increases the header's "My Cart (N)" count — polled rather than asserted once, to tolerate any client-side update delay.                                                               |
| | Cart line item + removal | An added item appears in `/cart`, and removing it takes the cart back to zero items.                                                                                                                    |
| | Checkout handoff | Proceeding to checkout from a non-empty cart navigates away from `/cart` (Shopify's hosted checkout is treated as out of scope for this sample).                                                        |
| `account-registration.spec.ts` | Sign-up navigation | Header "Sign up" link reaches `/account/register` with the form visible.                                                                                                                                |
| | Invalid submission | Submitting registration with no password does not proceed past the form.                                                                                                                                |
| | *(skipped)* Full registration | Happy-path account creation, left as `test.skip` since it would create a real record on the live demo store; included to show the flow would be covered, and easy to enable in an isolated environment. |
| `login-validation.spec.ts` | Invalid credentials | Logging in with a non-existent account shows a visible error and keeps the user on `/account/login`.                                                                                                    |
| | Login reachability | The header "Log In" link is reachable from the homepage and lands on a form with visible email/password fields.                                                                                         |

## BDD / Cucumber example

The suite above is plain Playwright Test, which is what this project uses day
to day. As a small example of how the same framework could support
Gherkin/BDD-style specs, `features/` wires up
[`@cucumber/cucumber`](https://github.com/cucumber/cucumber-js) on top of the
*same* page objects in `pages/` — nothing is duplicated, the step definitions
just drive `SearchPage` the same way `search.spec.ts` does.

Only one scenario is implemented, mirroring `search.spec.ts`'s "searching a
known product term returns that product" case:

- `features/search.feature` — the scenario in Gherkin.
- `features/step_definitions/search.steps.ts` — Given/When/Then steps that
  instantiate `SearchPage` and assert against it.
- `features/support/world.ts` / `hooks.ts` — a custom Cucumber `World` plus
  `Before`/`After` hooks that launch a Playwright browser/context per
  scenario (Playwright Test does this automatically via
  `playwright.config.ts`; Cucumber has no equivalent, so it's done by hand
  here).

Run it with:

```bash
npm run test:bdd
```

This is intentionally a single example, not a parallel test suite. Adopting
BDD project-wide would mean porting every `tests/*.spec.ts` scenario into
`.feature` files and step definitions, which is a larger decision than this
sample is meant to make.

## Design notes / trade-offs

- **Locators favor accessibility roles and visible text** (`getByRole`,
  `getByText`) over brittle CSS classes, since Shopify theme markup can
  change between deployments without changing what a user actually sees.
- **No hard-coded real user data.** `utils/testData.ts` generates unique,
  disposable emails/passwords per run so registration-style tests can be
  re-executed without colliding with prior test data.
- **Tracing/video/screenshots are captured only on failure** (see
  `playwright.config.ts`) to keep CI artifacts lean while still giving full
  debug context when something breaks.
- **One test is intentionally `skip`ped** (full registration) with an
  inline comment explaining why. This mirrors a real decision a QA
  engineer has to make about test data hygiene against a shared/live
  environment, rather than silently omitting the scenario.

## Note on scope

This is a small, representative sample, not a claim of full site coverage.
In a real project I'd extend this with: API-level setup/teardown (seeding
cart/account state via requests instead of the UI) and
accessibility checks (`@axe-core/playwright`) on the key pages above.

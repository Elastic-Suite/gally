# End-to-end tests with Playwright

End-to-end tests are executed in a Docker container using the Chromium browser in headless mode. All tests are run on the Gally application in English (en-US) to ensure a stable and consistent linguistic base for interface checks.

The entire setup has been containerized to guarantee reproducible execution and independence from the local environment. This facilitates:
+ deployment of tests in a CI/CD environment (e.g. GitHub Actions, GitLab CI),
+ execution on any machine (developer, QA, integrator...),
+ isolation of dependencies and system versions.

🎯 Test objectives

These tests aim to:

+ Validate the functional stability of the application after major changes (e.g. dependency migration, refactoring, library updates),
+ Detect critical regressions on main user journeys,
+ Ensure non-regression of key features with each release.

The goal is to use these tests as an automatic safety net to verify that the application remains functional despite structural changes.

## Project structure
```
📂 src/
├── 📂 helper/     # Shared utility functions between tests
│ ├── 📄 auth.ts
│ ├── 📄 dropdown.ts
│ ├── 📄 filter.ts
│ ├── 📄 global.ts
│ ├── 📄 grid.ts
│ ├── 📄 menu.ts
│ └── 📄 pagination.ts
│
├── 📂 tests/      # Playwright test files
│ ├── 📂 globals/     # Common tests - globals
│ │ ├── appBar.spec.ts
│ │ └── sideBar.spec.ts
│ │
│ └── 📂 pages/     # Tests spécifiques à chaque pages
    └── ...
```

## Best practices
+ Use helpers whenever possible
+ Do not use fixed wait(): Prefer await expect() with auto-retrying assertions. ([doc link](https://playwright.dev/docs/test-assertions#auto-retrying-assertions))<br>
This helps avoid flaky tests that work only sporadically.
+ Follow the project architecture:
    + global tests in: 📂 globals/
    + page-specific tests in: 📂 pages/<br>This folder follows the structure we've set up in the PWA for pages (Next.js router)
    + utility functions in 📂 helpers/
+ Favor the use of data-testid to select and perform actions on elements. (The data-testid attributes should be added in the gally-admin repo)

## Example of bad practices  
```ts
const inputNumber = await page.getByTestId('myInputNumber')
const value = await input.inputValue()
await expect(value).toBe('42') // No auto retrying
```

Instead, do:

```ts
const inputNumber = await page.getByTestId('myInputNumber')
await expect(inputNumber).toHaveValue('42')
```

## Timeout concepts
Playwright allows configuring different types of timeouts to handle asynchronous operations and prevent tests from hanging indefinitely. Here are the main timeouts you can configure in Playwright, and their purpose:
### 1. Global timeout (defaultTimeout): <br> <br>
 **Definition** :  This is the default timeout applied to all asynchronous operations (clicks, fills, navigation, waits, etc.) unless a specific timeout is defined for a particular action.<br><br>
**Purpose** : Prevents operations from getting stuck indefinitely if, for example, an element never appears.<br>
**Configuration** : 
```js
page.setDefaultTimeout(10000);
```

### 2. Navigation timeout
**Definition** : Timeout specific to navigation actions such as page.goto(), page.waitForNavigation(), page.reload(), etc.

**Purpose** : Controls how long Playwright waits for navigation to complete.

**Configuration** :

```js
page.setDefaultNavigationTimeout(15000); // 15 secondes
```
### 3. Action timeout
**Définition**: Timeout applied to a user action like click(), fill(), type(), etc.

**Purpose** : Limits how long to wait for specific actions.

**Configuration locale (par action)** :
```js
await page.click('button.submit', { timeout: 5000 }); // 5 secondes
```
**Configuration globale (pour toutes les actions)** :
```js
test.use({ actionTimeout: 5000 });
```
## 4. Timeout for assertions (expect)
 **Definition** : Timeout used during expect() assertions to wait for a condition to be met (e.g., visibility, content, state).

**Purpose** : Prevents tests from failing immediately if a condition is slightly delayed.

**Configuration** :
```js
await expect(locator).toBeVisible({ timeout: 3000 });
```

## 5. Test timeout
**Definition** : The maximum allowed time for the entire test execution.

**Purpose** : Prevents a test from running too long (e.g. due to an infinite loop or a bug).

**Configuration** :

By default : 30 seconds
**Surcharge locale** :

```js
test('my test', async ({ page }) => {
  // test code
}, 20000); // timeout à 20 secondes
```

**Surcharge globale dans le fichier de config**:
```js
// playwright.config.ts
timeout: 30000, // 30 secondes

## Commandes mises à disposition

### Lancer les tests sur le conteneur
```shell
make up
```

### Rentrer dans le conteneur des tests
```shell
docker compose exec e2e bash
```

### Commandes disponibles dans le package.json
```shell
yarn test
```

```shell
yarn test:premium
```
```shell
yarn test:standard
```

# Playwright Demo Framework

Enterprise-grade end-to-end automation framework for Magento 2.4.8 using Playwright + TypeScript, with multi-environment support, robust cross-environment testing capabilities, and complete CI/CD integration via GitHub Actions.

---

## Tech Stack

- **Playwright 1.53.1** - Modern browser automation
- **TypeScript** - Type-safe development
- **Page Object Model (POM)** - Maintainable test architecture
- **Multi-Environment Support** - Local, CI, and production configurations
- **Promise.race() Pattern** - Robust cross-environment verification
- **Docker Magento 2.4.8** - Containerized test environment
- **Automatic screenshots and videos** - Complete test artifacts
- **TestRail integration** - Test management integration
- **GitHub Actions CI/CD** - Automated testing pipeline
- **Dynamic environment loading** - Smart environment file detection

---

## Application Under Test

**Magento 2.4.8 E-commerce Platform** running in Docker containers with:

- Full sample data installation
- CAPTCHA disabled for testing
- Two-Factor Authentication disabled for API testing
- Optimized for cross-environment compatibility

**Test URLs:**

- CI Environment: `https://magento.test`
- Local Development: Configurable via `.env`

---

## Project Structure

```bash
playwright-demo-framework/
│
├── .github/
│   └── workflows/
│       └── main.yml              # GitHub Actions CI/CD with Docker Magento setup
│
├── api/
│   └── user.api.ts               # API utilities for user management
│
├── locators/
│   └── login/
│       ├── index.ts              # Dynamic locator loader based on ENV variable
│       ├── login.locators.ci.ts  # CI environment specific locators
│       └── login.locators.prod.ts # Production environment specific locators
│
├── src/
│   ├── pages/
│   │   └── login.page.ts           # Robust Page Object with Promise.race() patterns
│   └── tests/
│       └── login.spec.ts           # Cross-environment test specifications
│
├── utils/
│   └── test-users.ts             # Test user utilities and helpers
│
├── .env                          # Local development environment (not versioned)
├── .env.ci                       # CI environment configuration (versioned)
├── .env.prod                     # Production environment configuration (versioned)
├── .env.example                  # Example environment variables template
├── .gitignore                    # Comprehensive ignore rules for all environments
├── package.json                  # Dependencies with Playwright 1.53.1
├── playwright.config.ts          # Multi-environment configuration with dynamic loading
├── README.md                     # This documentation
├── testrail.config.js            # TestRail integration setup
└── tsconfig.json                 # TypeScript configuration
```

---

## Key Features

### 🌍 Multi-Environment Support

- **Dynamic Environment Loading**: Automatically loads `.env`, `.env.ci`, or `.env.prod` based on `ENV` variable
- **Dynamic Locator Loading**: Environment-specific locators loaded automatically via `/locators/` directory
- **Cross-Environment Compatibility**: Tests work consistently across local and CI environments
- **Smart Configuration**: Environment-specific settings for timeouts, headless mode, and SSL handling

### 🛡️ Robust Testing Patterns

- **Promise.race() Pattern**: Multiple verification strategies for maximum reliability
- **Text-Based Detection**: Environment-agnostic error and success detection
- **Fallback Mechanisms**: Multiple selectors and detection methods per verification

### 🚀 Complete CI/CD Integration

- **Automated Magento Setup**: Full Docker-based Magento 2.4.8 installation in CI
- **Artifact Management**: Screenshots, videos, and HTML reports preserved
- **Security**: Proper secrets management for all credentials

---

## System Prerequisites

- **Node.js** >= v20.x
- **NPM** (latest)
- **Git**
- **Docker** (for CI environment or local Magento setup)

---

## Quick Start

### 1. Clone and Install

```bash
git clone https://github.com/uzzielsr/playwright-demo-framework.git
cd playwright-demo-framework
npm install
npx playwright install chromium --with-deps
```

### 2. Environment Setup

Copy the example environment file and configure it:

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Run Tests

```bash
# Local environment (uses .env)
npx playwright test --project=chromium --reporter=list,html

# CI environment (uses .env.ci)
ENV=ci npx playwright test --project=chromium --reporter=list,html

# Production environment (uses .env.prod)
ENV=prod npx playwright test --project=chromium --reporter=list,html
```

---

## Environment Configuration

### Local Development (.env)

```bash
BASE_URL=https://your-magento-instance.com
TEST_EMAIL=test@example.com
TEST_PASSWORD=your_password
TEST_FIRST_NAME=Test
TEST_LAST_NAME=User
INVALID_EMAIL=invalid@example.com
INVALID_PASSWORD=wrongpassword
```

### CI Environment (.env.ci)

Automatically configured during GitHub Actions workflow with:

- Docker Magento 2.4.8 installation
- Sample data and optimized settings
- All necessary credentials via GitHub secrets

### Production Environment (.env.prod)

Configure for production testing with appropriate URLs and credentials.

---

## Robust Testing Architecture

### Page Object Model with Promise.race()

Our Page Objects use a robust `Promise.race()` pattern for maximum reliability:

```typescript
async isUserLoggedIn(username: string) {
    await Promise.race([
        expect(this.page.locator(LoginSelectors.loggedInIndicator).first()).toContainText(`Welcome, ${username}`, { timeout: 10000 }),
        expect(this.page).toHaveURL(/.*customer\/account.*/, { timeout: 10000 }),
        expect(this.page.locator('body')).toContainText(`Welcome, ${username}`, { timeout: 10000 })
    ]);
}

async isErrorDisplayed() {
    await Promise.race([
        expect(this.page).toHaveURL(/.*customer\/account\/login.*/, { timeout: 10000 }),
        expect(this.page.locator(LoginSelectors.usernameField)).toBeVisible({ timeout: 10000 }),
        expect(this.page.locator(LoginSelectors.passwordField)).toBeVisible({ timeout: 10000 }),
        expect(this.page.locator('body')).toContainText('The account sign-in was incorrect', { timeout: 10000 }),
        expect(this.page.locator('body')).toContainText('Invalid Form Key', { timeout: 10000 })
    ]);
}
```

This approach provides:

- **Multiple verification strategies** per action
- **Cross-environment compatibility**
- **Fallback mechanisms** for different Magento configurations
- **Fast execution** (first successful verification wins)

---

## CI/CD with GitHub Actions

### Automated Workflow Features

- **🐳 Complete Magento Setup**: Automated Docker installation of Magento 2.4.8
- **📦 Sample Data**: Automatic installation and configuration
- **� Optimization**: CAPTCHA and 2FA disabled for testing
- **🧪 Test Execution**: Full Playwright test suite with multiple reporters
- **📊 Artifact Collection**: Screenshots, videos, and HTML reports
- **🔄 Multi-Environment**: Supports different environment configurations

### Workflow Triggers

- Pull requests to `main` branch
- Daily scheduled runs at 11:00 UTC
- Manual workflow dispatch

### Secrets Configuration

Configure the following secrets in GitHub repository settings:

```bash
# Magento Configuration
MAGENTO_PUBLIC_KEY=your_magento_public_key
MAGENTO_PRIVATE_KEY=your_magento_private_key
BASE_URL=https://magento.test

# Test User Configuration
TEST_EMAIL=test@example.com
TEST_PASSWORD=secure_password
TEST_FIRST_NAME=Test
TEST_LAST_NAME=User
TEST_EMAIL_DOMAIN=example.com

# Admin Configuration
ADMIN_USERNAME=admin_user
ADMIN_PASSWORD=admin_password

# Magento Store Configuration
MAGENTO_WEBSITE_ID=1
MAGENTO_STORE_ID=1
MAGENTO_GROUP_ID=1

# Invalid Credentials for Error Testing
INVALID_EMAIL=invalid@example.com
INVALID_PASSWORD=wrongpassword

# TestRail Integration (Optional)
TESTRAIL_HOST=your-testrail-instance.com
TESTRAIL_USER=your_email@company.com
TESTRAIL_PASSWORD=your_testrail_password
TESTRAIL_PROJECT_ID=123
TESTRAIL_SUITE_ID=456
```

---

## Creating New Tests

### 1. Add Locators

Create environment-specific locators under `locators/feature/`:

```typescript
// locators/feature/feature.locators.ci.ts
export const featureLocators = {
  primaryButton: '[data-testid="primary-action"]',
  statusIndicator: ".status-display",
  errorMessage: ".error-container",
};
```

```typescript
// locators/feature/feature.locators.prod.ts
export const featureLocators = {
  primaryButton: '[data-testid="primary-action"]',
  statusIndicator: ".status-display",
  errorMessage: ".error-container",
};
```

```typescript
// locators/feature/index.ts (Dynamic Loader)
const ENV = (process.env.ENV || "prod").toLowerCase();

let locatorsModule: any;

switch (ENV) {
  case "prod":
    locatorsModule = require("./feature.locators.prod");
    break;
  default:
    locatorsModule = require("./feature.locators.ci");
}

export const featureLocators = locatorsModule.featureLocators;
```

### 2. Create Page Object

```typescript
// src/pages/feature.page.ts
import { Page, expect } from "@playwright/test";
import { FeatureSelectors } from "../constants/selectors/feature.selectors";

export class FeaturePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async performAction() {
    await this.page.locator(FeatureSelectors.primaryButton).click();
  }

  async verifySuccess() {
    await Promise.race([
      expect(this.page.locator(FeatureSelectors.statusIndicator)).toContainText(
        "Success"
      ),
      expect(this.page).toHaveURL(/.*success.*/),
      expect(this.page.locator("body")).toContainText("Operation completed"),
    ]);
  }
}
```

### 3. Write Test Specification

```typescript
// src/tests/feature.spec.ts
import { test, expect } from "@playwright/test";
import { FeaturePage } from "../pages/feature.page";

test.describe("Feature functionality", () => {
  test("@C1234 Should perform action successfully", async ({ page }) => {
    const featurePage = new FeaturePage(page);

    await featurePage.performAction();
    await featurePage.verifySuccess();
  });
});
```

---

## Troubleshooting

### Common Issues

1. **Environment Variables Not Loaded**

   - Ensure correct `.env` file exists
   - Check `ENV` variable is set correctly for CI/prod environments

2. **Cross-Environment Test Failures**

   - Review selector specificity
   - Consider using text-based detection over CSS selectors
   - Implement Promise.race() pattern for robustness

3. **CI Environment Issues**
   - Verify GitHub secrets are configured
   - Check Docker Magento setup logs in workflow output

### Debug Mode

Enable debug output:

```bash
DEBUG=pw:* npx playwright test --project=chromium --reporter=list,html
```

For verbose Playwright traces:

```bash
npx playwright test --project=chromium --reporter=list,html --trace on
```

---

## Contributing

1. Create feature branch: `git checkout -b feature/your-feature`
2. Follow existing patterns (Promise.race(), Page Objects, etc.)
3. Ensure cross-environment compatibility
4. Add appropriate test coverage
5. Submit pull request

---

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Support

For questions or issues:

1. Check the troubleshooting section above
2. Review existing GitHub issues
3. Create a new issue with detailed reproduction steps
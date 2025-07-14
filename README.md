# Playwright Demo Framework

Enterprise-grade end-to-end automation framework using **Playwright + TypeScript** with TestRail integration and CI/CD via GitHub Actions.

---

## Tech Stack

- Playwright
- TypeScript
- Page Object Model (POM)
- Tracing (for debugging failures)
- Automatic screenshots and videos
- TestRail integration
- GitHub Actions for CI/CD
- Selector constants via TypeScript modules

---

## Application Under Test

Magento Demo E-commerce site:

<https://magento.softwaretestingboard.com/>

---

## Project Structure

```bash
playwright-demo-framework/
│
├── .github/
│   └── workflows/
│       └── main.yml                # GitHub Actions workflow for CI/CD
│
├── src/
│   ├── constants/
│   │   └── selectors/
│   │       └── login.selectors.ts  # Centralized selectors for login page
│   ├── pages/
│   │   └── login.page.ts           # Page Object Model for login
│   └── tests/
│       └── login.spec.ts           # Playwright test specs
│
├── .env                            # Environment variables (not versioned)
├── .env.example                    # Example environment variables file
├── .gitignore                      # Git ignore rules
├── package.json                    # Project dependencies and scripts
├── package-lock.json               # NPM lock file
├── playwright.config.ts            # Playwright configuration
├── README.md                       # Project documentation
├── testrail.config.js              # TestRail integration config
└── tsconfig.json                   # TypeScript configuration
```

---

## System Prerequisites

- Node.js >= v20.x
- NPM
- Git

---

## Initial Setup

```bash
git clone https://github.com/<your-github-username>/playwright-demo-framework.git
cd playwright-demo-framework
npm install
npx playwright install --with-deps
```

---

## How to Run the Tests

### Run all tests and report to TestRail

```bash
npm run test:with-report
```

### Run tests in headed mode (browser visible)

```bash
npm run test:headed:with-report
```

---

## Output Artifacts

- **Screenshots and videos:** `/test-results/`
- **HTML report:** `/playwright-report/`

---

## Environment Configuration

Create a `.env` file in the project root with the following variables:

```bash
TESTRAIL_HOST=
TESTRAIL_USER=
TESTRAIL_PASSWORD=
TESTRAIL_PROJECT_ID=
TESTRAIL_SUITE_ID=

BASE_URL=
TEST_EMAIL=
TEST_PASSWORD=
INVALID_EMAIL=
INVALID_PASSWORD=
```

These are automatically set in CI via GitHub secrets.

---

## TestRail Integration

- Test results are automatically reported to TestRail using the credentials and IDs from your `.env` file.
- Make sure your TestRail project and suite IDs are correct.

---

## CI/CD with GitHub Actions

- The main workflow (`.github/workflows/main.yml`) installs dependencies, browsers, sets environment variables, runs tests, and uploads artifacts on every pull request and daily at 11:00 UTC.
- Test results and reports are uploaded as artifacts.

---

## Contributing

Contributions are welcome! Please open an issue or pull request for suggestions or improvements.

---

Updated to reflect the current state of the project and its integration with Playwright, TestRail, and GitHub Actions.

---

## 🔧 Jenkins CI/CD Setup with GitHub Webhook + Ngrok + TestRail Integration

This project also supports executing tests through Jenkins using GitHub webhooks and optional ngrok tunneling for local development.

### 🖥️ 1. Jenkins Build Script

Inside Jenkins → your project → **Configure** → **Build** → **Execute Shell**, add the following script (with your real credentials set as Jenkins environment variables or injected via secrets):

```bash
#!/bin/bash

# ✅ Load NVM and use correct Node version
export NVM_DIR="$HOME/.nvm"
source "$NVM_DIR/nvm.sh"
nvm use 22

# ✅ TestRail + Jenkins config (inject via Jenkins credentials or environment)
export TESTRAIL_HOST="$TESTRAIL_HOST"
export TESTRAIL_USER="$TESTRAIL_USER"
export TESTRAIL_PASSWORD="$TESTRAIL_PASSWORD"
export TESTRAIL_PROJECT_ID="$TESTRAIL_PROJECT_ID"
export TESTRAIL_SUITE_ID="$TESTRAIL_SUITE_ID"

export BASE_URL="$BASE_URL"
export TEST_EMAIL="$TEST_EMAIL"
export TEST_PASSWORD="$TEST_PASSWORD"
export INVALID_EMAIL="$INVALID_EMAIL"
export INVALID_PASSWORD="$INVALID_PASSWORD"

# ✅ Clean & install
rm -rf node_modules
npm install
npm run install:browsers

# ✅ Run tests with TestRail reporter
npm run test:with-report
```

> 🔐 Do not hardcode credentials. Use Jenkins credentials plugin or environment injection.

---

### 🌐 2. Ngrok Tunnel (Optional for Local Jenkins)

If Jenkins is running locally (e.g., `http://localhost:9090`), use [ngrok](https://ngrok.com/) to expose it:

```bash
ngrok http 9090
```

Use the generated HTTPS forwarding URL as your webhook target in GitHub.

---

### 🔔 3. GitHub Webhook Setup

1. Go to **Settings → Webhooks → Add Webhook** in your GitHub repo.
2. Use the following settings:
   - **Payload URL**: `https://<ngrok-forwarding-url>/github-webhook/`
   - **Content type**: `application/json`
   - **Event**: Just the `push` event (or customize)
3. Ensure Jenkins is listening to GitHub events via:
   - **Build Triggers** → Check `GitHub hook trigger for GITScm polling`

---

### 📦 4. Jenkins Artifacts (Optional)

To archive test results (screenshots, videos, and reports):

1. In Jenkins → Project → **Configure** → **Post-build Actions**
2. Add **"Archive the artifacts"**
3. Set path:

```bash
test-results/**/*.*
```

---

This configuration enables full integration between GitHub, Jenkins, TestRail, and Playwright.

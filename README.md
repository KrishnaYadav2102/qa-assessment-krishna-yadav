# GoQuant QA Bootcamp Automated Testing Assessment

This repository contains the automated testing solution for the **GoQuant internal testing platform**  
(https://test1.gotrade.goquant.io/), developed as part of the **QA Bootcamp Assessment**.  
The goal is to evaluate the application's **stability, functionality, and user experience** by implementing a comprehensive, systematic, and maintainable test suite.

---

## 🎯 1. Testing Approach: Risk-Based and User-Centric

Our testing strategy follows a **Risk-Based, User-Centric Approach**.

- **Prioritization:** Focus on core business functions — _Authentication_ and _Order Placement_ — as they represent the highest risk areas.
- **User Flows:** Tests are designed to mimic _real-world user journeys_, ensuring end-to-end usability.
- **Comprehensive Coverage:** Includes multiple categories — _Functional_, _UI/UX_, and _Edge Case_ — to uncover both obvious and subtle defects.
- **Failure Analysis:** The aim is not 100% pass rate but _accurate diagnosis and professional documentation_ of each failure, given the platform’s intentional instability.

---

## 📝 2. Test Categories Implemented

The test suite is structured into the following key categories for holistic coverage:

| **Category**             | **Focus Area**                                                                  | **Goal**                                                                                      |
| ------------------------ | ------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| **Functional**           | Authentication, Order Placement, Portfolio Operations, Navigation               | Validate that all core features behave as per specifications (Positive & Negative scenarios). |
| **UI/UX**                | Responsiveness, Visual Consistency, Loading States, Error Display               | Ensure a positive user experience and detect visual regressions.                              |
| **Edge Case & Boundary** | Input validation (min/max/invalid values), Network failures, Concurrent actions | Identify flaws in input handling, resilience, and data consistency under stress.              |
| **Accessibility**        | Basic WCAG compliance checks (Playwright tools)                                 | Ensure basic usability for all users.                                                         |

---

## 🛠️ 3. Tools and Frameworks

| **Tool/Framework**           | **Role**                          | **Rationale**                                                                                                                                                  |
| ---------------------------- | --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Playwright**               | Primary Test Automation Framework | Offers cross-browser support (Chromium, Firefox, WebKit), auto-waiting, network mocking, and built-in tracing — essential for debugging unstable applications. |
| **TypeScript**               | Programming Language              | Static typing improves code quality, maintainability, and refactoring safety — key for a senior-level assessment.                                              |
| **Page Object Model (POM)**  | Design Pattern                    | Separates test logic from page structure, making tests clean, scalable, and reusable.                                                                          |
| **Playwright HTML Reporter** | Reporting                         | Generates detailed, interactive reports — crucial for assessment documentation and evidence.                                                                   |

---

## ⚙️ 4. How to Run the Test Suite

Follow these steps to set up and execute the automated tests locally.

### 4.1 Prerequisites

- [Node.js (LTS version)](https://nodejs.org/)
- [Git](https://git-scm.com/)

---

### 4.2 Setup Instructions

#### Clone the Repository

```bash
git clone git@github.com:KrishnaYadav2102/qa-assessment-krishna-yadav.git
cd qa-assessment-krishna-yadav
```

Install Dependencies:

```bash
npm install
```

Install Browser Drivers (if needed):

```bash
npx playwright install
```

### 4.3 Running Tests

All tests are configured to run headlessly across the three major browsers (Chromium, Firefox, WebKit) as defined in `playwright.config.js`.

Run the Full Test Suite (Recommended):
This command executes all tests and generates the comprehensive HTML report.

```bash
npx playwright test
```

Run a Specific Test File
To run only the authentication tests:

```bash
npx playwright test tests/auth.spec.ts
```

Run Tests on a Single Browser
To run all tests only on Chromium:

```bash
npx playwright test --project=chromium
```

### 4.4 Viewing the Test Report

After running the full suite (`npx playwright test`), the Playwright HTML Reporter can be opened with the following command:

```bash
npx playwright show-report
```

This will open an interactive report in your browser, located in the `playwright-report` directory, which serves as key evidence for the assessment submission.

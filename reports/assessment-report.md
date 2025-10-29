# Assessment Report: GoQuant Application

---
**Application Under Test:** GoQuant – Trading and Portfolio Management Dashboard  
**Test Period:** October 22–29, 2025  
**Tester:** Krishna Yadav  
**Testing Framework:** Playwright with TypeScript  
**Browsers Tested:** Chromium 118.0, Firefox 119.0, WebKit 17.0  

---

## Executive Summary

This report presents a comprehensive evaluation of the **GoQuant Dashboard**, focused on validating its authentication, session management, trading workflows, portfolio management capabilities, data integrity, and user experience across different browsers and devices. Testing was conducted using automated and exploratory approaches to assess both functional and non-functional aspects of the platform.

### High-Level Overview of Testing Activities

The testing process covered a wide range of areas to ensure platform stability, accuracy, and usability:

**Functional Testing**
- Verified user authentication flows including valid/invalid credentials and session management.
- Validated core trading functionality such as order placement, modification, and cancellation.
- Tested portfolio operations including viewing positions and accurate P&L calculation.
- Conducted data validation and form handling checks across multiple modules.
- Assessed navigation consistency and route accessibility throughout the application.

**UI/UX Testing**
- Checked responsive design behavior across multiple viewport sizes (desktop, tablet, mobile).
- Validated cross-browser compatibility (Chromium, Firefox, WebKit).
- Assessed loading states, transitions, and error-handling behaviors.

**Edge Case & Boundary Testing**
- Input validation using extreme and invalid values.
- Simulated network failures and recovery handling.

---

### Key Findings and Recommendations

Testing identified **x significant issues**, including **y critical**, **z high**, **x medium**, and **x low-priority** defects.

**Key Findings**
### Key Findings

During the testing cycle, several recurring patterns and issues were observed that directly affect the reliability, performance, and user experience of the GoQuant Dashboard.

A common issue identified across multiple test scenarios was the **degradation of real-time data updates**, particularly noticeable in the **Orders**, **Positions**, and **Metrics** components. Data synchronization delays and occasional missing updates led to discrepancies between backend data and what was displayed to users.

The application also exhibited **performance degradation** when multiple exchange accounts were integrated or when the platform remained open for extended periods. In such cases, UI responsiveness dropped significantly, and automation tests frequently timed out due to slow or incomplete API responses. Concurrent user sessions further amplified this behavior, suggesting underlying **server latency and frontend rendering inefficiencies**.

Functionally, the system displayed **inconsistent order management behaviors**, including orders not appearing across relevant tabs (Working Orders, Order History, Open Positions, and Assets). Related workflows, such as order modification, cancellation, and liquidation, occasionally failed or behaved unpredictably.

Additionally, several modules — including *Post Trade Analytics*, *GoRisks*, and *GoOps* — failed to load consistently, with *GoOps reconciliations* sometimes showing data from unlinked accounts. Administrative operations under *Admin > Accounts* were also impacted, preventing updates and configuration changes.

From a usability perspective, **UI inconsistencies were prominent on WebKit browsers (Safari)** and smaller viewports such as tablets and mobile devices. Layout misalignments and content clipping affected readability and overall user experience.

In summary, the testing revealed **core stability and data consistency challenges**, emphasizing the need for focused optimization in real-time data handling, server performance, and cross-browser compatibility before the application can be considered production-ready.

**Recommendations**
1. Postpone production deployment until all **critical and high-priority issues** are resolved.  
2. Prioritize fixes for order lifecycle synchronization, server performance optimization, and module-level stability (GoOps, GoSettle, GoRisks).  
3. Enhance backend scalability and implement performance profiling for concurrent user sessions.  
4. Expand automated testing coverage to include regression and data consistency scenarios.  
5. Conduct accessibility revalidation post UI fixes to meet WCAG 2.1 AA compliance.  
6. Integrate continuous testing in CI/CD pipelines to identify regressions early.

---

### Overall Platform Stability Assessment

Based on the current testing cycle, **GoQuant Dashboard is not yet production-ready**. The platform demonstrates functional completeness in isolated workflows but suffers from **instability under concurrent usage**, **data synchronization issues**, and **critical performance bottlenecks**.  
User-facing reliability remains inconsistent across environments, particularly in multi-user sessions and real-time trading modules.  
Until the high-impact issues are resolved and subsequent regression validation confirms stability, the system should be considered in a **“pre-stabilization” phase**.  
Once addressed, GoQuant has the potential to meet enterprise-grade reliability and usability standards.

---

## Testing Methodology

### Testing Approach

A **risk-based testing strategy** was employed, prioritizing critical trading workflows, data integrity, and high-impact user interactions within the GoQuant Dashboard.  

The testing process was structured into **three key phases**, each designed to build progressively upon the results of the previous stage:

1. **Smoke Testing:**  
   Verified baseline functionality across all supported browsers, ensuring the system was stable enough for deeper testing.  
   Key validations included login/logout, dashboard access, integration of exchange accounts, order placement, portfolio loading, and basic navigations and page transitions.

2. **Functional Testing:**  
   Validated all critical user workflows end-to-end, including order placement, modification, and cancellation; portfolio and asset updates; P&L recalculations; CRUD operations on exchange accounts; and execution strategy validations.  
   This phase also included data integrity checks, form validation, and UI responsiveness across different viewports.

3. **Edge and Stress Testing:**  
   The application was deliberately stressed by integrating multiple exchange accounts under a single user session.  
   Additional tests included extreme data inputs, network failure simulations.

---
### Test Case Selection Rationale

The selection and prioritization of test cases were based on a detailed **risk assessment** of the GoQuant application — balancing business impact, user visibility, and technical complexity.  
A total of **80 test cases** were designed to ensure adequate coverage across functional areas. 

1. **Authentication (8 tests):**  
   Authentication was treated as the most critical module, as it governs access control and system security. Test cases validated correct login/logout flows, invalid credential handling, form validation, email format enforcement and username length checks.  
   The objective was to confirm that only authorized users could access protected resources while preventing unnecessary load on backend resources and data exposure.

2. **CRUD Operations on Exchange Accounts (23 tests):**  
   Given that GoQuant relies heavily on third-party exchange integrations, this module was identified as a critical dependency, extensive test cases were created to validate account integration, modification, and deletion.  
   Edge scenarios included duplicate account additions, invalid API/secret key combinations, missing passphrases validation.  
   These tests ensured that integrations remained stable and secure across multiple exchanges.
   Out of 23 tests 6 tests failing due to 1 issue i.e. modify account API is failing.

3. **Order Placements (49 tests):**  
   This formed the core functional area of the application. Test cases spanned across all supported order types and strategies — including Market Edge, Limit Edge, TWAP Edge, VWAP, Market, Limit, TWAP.  
   Tests spanned various combinations of **Buy/Sell**, **SPOT/SWAP/Futures**, and multiple **Time-in-Force (TIF)** configurations (GTC, GTT, IOC, FOK, Day).  
   Order modification, cancellation, and liquidation workflows were validated along with field-level input and range validations to ensure reliability under real-world use cases.
   Out of 49 tests 6 tests are failing due to input field validations & almost for all of them the orders are not filling & portfolio / positions are not updating.
---

## Tools and Techniques Employed

1. **Automation Framework:**  
   The test automation framework was built using **Playwright with TypeScript** as the primary tool. It was selected for its robust cross-browser capabilities.  
   The **Page Object Model (POM)** design pattern was adopted to ensure maintainable, modular, and reusable test code for each major screen and functional component.  
   Additionally, **Playwright provides a rich and visually detailed HTML report**, which offers deep insights into each test execution — including screenshots, trace logs, and console outputs.  
   This report significantly aids in **analyzing and debugging failures**, reducing triage time and improving test visibility across the team.

2. **Test Data Management:**  
   Test data was managed using structured **JSON fixtures**, allowing for reproducible and isolated test runs.  
   This ensured that test executions remained independent of previous runs and reduced the likelihood of data collisions or state persistence issues.

3. **Code Quality and Formatting Tools (ESLint & Prettier):**  
   To maintain consistent and high-quality code across the automation suite, **ESLint** was integrated for static code analysis and enforcing coding standards.  
   It helped identify potential issues such as unused variables, incorrect async handling, and inconsistent imports early in the development cycle.  
   **Prettier** was used alongside ESLint to automatically format code, ensuring uniform styling, indentation, and readability across all test files.  
   Together, these tools improved maintainability, reduced code review effort, and ensured that the automation codebase remained clean, reliable, and easy to scale.

4. **CI/CD Integration (GitHub Actions):**  
   Continuous Integration and Continuous Deployment (CI/CD) were implemented using **GitHub Actions** to automate test execution on every code commit and pull request.  
   The workflow ensures that Playwright tests run across multiple browsers and environments in parallel, providing immediate feedback on build stability and regression risks.  
   Test results, HTML reports, and trace logs are automatically uploaded as workflow artifacts, enabling quick access and analysis for the QA and development teams.  
   This integration not only improves release confidence but also enforces a consistent testing discipline by detecting issues early in the development cycle and maintaining continuous quality assurance.

5. **Responsively App:**  
   The **Responsively App** was utilized to validate the application's behavior and visual consistency across multiple viewport sizes and device resolutions simultaneously.  
   It provided an efficient way to inspect UI layouts, detect alignment issues, and ensure responsiveness for desktop, tablet, and mobile viewports.  
   By mirroring interactions across devices in real time, it significantly reduced manual effort in cross-device testing and improved overall coverage for responsive UI validation.

6. **Playwright Codegen:**  
   The **Playwright Codegen** tool was used to accelerate test script development by recording user interactions and automatically generating corresponding Playwright test code.  
   This feature proved highly effective during the initial phase of framework setup and exploratory testing, allowing rapid creation of test scripts for complex UI flows.  
   It also served as a valuable reference for identifying selectors, validating locators, and refining the Page Object Model implementation, thereby improving overall script accuracy and development efficiency.

7. **AI Tools (ChatGPT & Google Gemini):**  
   **ChatGPT** and **Google Gemini** were utilized to enhance documentation quality, improve code readability, and assist in generating meaningful inline comments throughout the automation framework.  
   These tools were instrumental in drafting well-structured Markdown documentation, summarizing complex logic for easier understanding, and ensuring consistent commenting standards across the codebase.  
   By leveraging AI for routine documentation and code annotation tasks, overall productivity increased while maintaining clarity and traceability in both test scripts and project reports.

8. **Winston Logger:**  
   Winston **logging utility** was implemented to enhance log readability, traceability, and debugging efficiency during automated test executions.  
   Structured log messages were configured to capture test execution info, step-level execution details, and error traces in a human-readable format.  
   The logger provided clear context for each test run, making it easier to identify root causes of failures without sifting through verbose console outputs.  
   This improved overall debugging speed, streamlined test triage during CI runs, and provided a transparent execution history for test reporting and analysis.

---

## Challenges Encountered and Solutions Implemented

| Challenge | Description | Solution Implemented |
|------------|--------------|----------------------|
| **New to Playwright Framework** | Initially, understanding Playwright’s structure, features, and APIs was challenging as it was a new tool in the automation stack. | Studied Playwright’s official documentation ([playwright.dev/docs/intro](https://playwright.dev/docs/intro)) and built small proof-of-concept scripts to gain hands-on experience before implementing the full automation framework. |
| **Absence of Test IDs for Locators** | Many UI elements lacked dedicated `data-testid` attributes, making element identification difficult and fragile. | Referred to Playwright documentation for best locator strategies, utilized **Playwright Codegen** to capture stable selectors, and leveraged **AI tools (ChatGPT & Gemini)** for improving locator logic and best practices. |
| **Testing a Large Application Within Tight Timelines** | GoQuant is a feature-rich platform, making it challenging to test comprehensively under limited timelines. | Defined the **scope of testing and automation** early, applied a **risk-based testing strategy**, and prioritized high-impact modules to ensure maximum coverage within the available time. |
| **Responsive and Multi-Viewport Testing** | Verifying UI and UX consistency across multiple devices and screen sizes required significant effort. | Used **Responsively App** and browser developer tools to efficiently validate the application across desktop, tablet, and mobile viewports. Identified layout breaks early. |
| **Test Timing Out Due to Slow Application Response** | During automation runs, certain test cases failed intermittently due to delayed UI updates and slow API responses from the backend. | Increased the **test timeout** to 120 seconds and **expect timeout** to 20 seconds in Playwright configuration, providing sufficient buffer for slow responses while maintaining test reliability. |
---

## Detailed Findings

### Critical Issues

**BUG-001: Order Accepted Beyond Available Balance**  
**Severity: Critical** 
**Browser:** All  
**Description:**  
The system allows users to place orders **exceeding their available account balance**.  
Despite insufficient funds, the order is accepted without any validation error or warning message, resulting in inconsistent account states and misleading UI feedback.

**Expected Behavior:**  
The system should validate available balance before order submission.  
If the order amount exceeds the user’s available balance, the application should display an appropriate error message (e.g., *“Insufficient balance to place this order”*) and prevent execution.

**Actual Behavior:**  
Orders exceeding available balance are accepted without any validation error.  
The UI displays the order is accepted, even though the backend does not execute it or update balances accordingly.

**Evidence:** 
https://drive.google.com/file/d/16vg-f2LfFraBtNPtUqxLT2kJbLu7c-IC/view?usp=drive_link


**Bug-002: GoOps Reconciliation Displays Orders from Unlinked Accounts**  
**Severity:** Critical  
**Browser:** All (Observed on Chromium, Firefox, Safari)  
**Description:**  
In the **GoOps → Reconciliation** tab, orders from accounts **not linked to the currently logged-in user** are being displayed.  
For example, while logged in with user `user19@goquant.io`, orders belonging to other accounts such as `qa_bootcamps`, `aleenatest_okx`, and `demo_test_okx` are visible in the Account column.  
This represents a significant **data isolation and privacy breach**, allowing users to access other users’ trading data.

**Expected Behavior:**  
The Reconciliation tab should only display orders and trade data associated with the currently logged-in user’s linked accounts.  
No data from other users or unlinked accounts should be visible or accessible.

**Actual Behavior:**  
Orders from multiple unrelated accounts appear in the Reconciliation tab, exposing sensitive trading and account data to unauthorized users.

**Evidence:**  
https://drive.google.com/file/d/1Uloi55iRxvrv4Urg4iuKWZhPUwKmhVpo/view?usp=drive_link


**Bug-003: Editing Trade Data in GoOps Reconciliation Triggers 500 Internal Server Error**  
**Severity:** Critical  
**Browser:** All  
**Description:**  
When attempting to **edit trade data** in the **GoOps → Reconciliation** module, the API call to update trade information fails with a **500 Internal Server Error** response.  
The issue occurs consistently for multiple records, indicating a possible backend validation or processing fault rather than a transient network issue.

**Expected Behavior:**  
Editing a valid trade record should successfully update the data and return a `200 OK` response.  
The updated record should immediately reflect in the Reconciliation table without throwing any error.

**Actual Behavior:**  
Each time a user edits and saves trade details, the PUT request to the `/api/v1/reconciliation/{id}` endpoint fails with:  
`Status Code: 500 Internal Server Error`  
The update operation fails silently in the UI without displaying a clear error message to the user.

**Evidence:**  
https://drive.google.com/file/d/1stHsTyuDqJJDYLalq_-Nr_yDsuzh1euG/view?usp=drive_link
https://drive.google.com/file/d/1vxIoidvYEA0gexiR9OAxmGc6YBOx_qhp/view?usp=drive_link

**Request Details:**  
```
curl 'https://test1.gotrade-api.goquant.io/api/v1/reconciliation/09aa0022-21f5-452a-8753-8a2590e99f44' \
  -X 'PUT' \
  -H 'accept: application/json, text/plain, */*' \
  -H 'accept-language: en-US,en;q=0.9,hi;q=0.8' \
  -H 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTlAZ29xdWFudC5pbyIsImV4cCI6MTc2MjI0NjkzMywicm9sZSI6InVzZXIiLCJpZCI6MjB9.noSLkoYSw_G1p1-YkdP6yGCDk1K8byta0ASn8dqOZmU' \
  -H 'client-api-key: 94fbcf0815d0ec8b292d61e805b7f83b' \
  -H 'content-type: application/json' \
  -H 'user-access-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTlAZ29xdWFudC5pbyIsImV4cCI6MTc2MjI0NjkzMywicm9sZSI6InVzZXIiLCJpZCI6MjB9.noSLkoYSw_G1p1-YkdP6yGCDk1K8byta0ASn8dqOZmU' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36' \
  --data-raw '{"exchange_quantity":0.01,"exchange_price":4200.64,"exchange_fees":0.00210032,"exchange_direction":"sell","reconciliation_status":"unreconciled","notes":"Order ID not found in OEMS - OKX"}'
```
---
### High Priority Issues

**BUG-004: "New Transfer" Request Fails in GoSettle Module**  
**Severity: High** 
**Browser:** All  
**Description:**  
When attempting to perform a **New Transfer** under **Accounts → GoSettle**, the transfer request consistently fails with an AxiosError (`Request failed with status code 400`).  
The issue occurs even when valid account selections and input values are provided for both “From” and “To” accounts.

**Expected Behavior:**  
The system should successfully process valid transfer requests between linked accounts and display a confirmation message once the transaction is complete.

**Actual Behavior:**  
Transfer request fails immediately after clicking the **Transfer** button.  
An error message is displayed — *“Transfer failed: AxiosError: Request failed with status code 400”*.  
No data is updated in the Transfers list or backend.  
**Evidence:** 
https://drive.google.com/file/d/12zXljevlGVE5_MHa6CbP9xtlIb1eDDF5/view?usp=drive_link

---

### Medium Priority Issues

**BUG-005: UI Inconsistencies in Webkit browser**  
**Severity:** Medium  
**Browser:** Safari (WebKit)  
**Description:**  
The login form overlaps with the live Order Book background, making the form fields partially unreadable and difficult to interact with.
Metrics blocks are not where they are expected. Metrics blocks are seen getting mixed with order book at the bottom.
These issues appear specifically in Safari.  

**Expected Behavior:**  
The login modal should render in the foreground, clearly separated from background components with proper layering and opacity.  

**Actual Behavior:**  
The login form visually merges with the Order Book table, causing readability issues for input fields and labels.  

**Evidence:** 
https://drive.google.com/file/d/1zgOFuW3YQHW-Y_yf7uYt3Vd9MP1asOdQ/view?usp=drive_link
https://drive.google.com/file/d/15kkgryv_jRuokGy4KreRMGHiD1tB2B6N/view?usp=drive_link
https://drive.google.com/file/d/1Ul53bQAFAvDUC5kEwyUO_X7zATe0GpSD/view?usp=drive_link


**BUG-006: Limit Edge Order Accepts Invalid Price Values (0 or Negative)**  
**Severity: Medium** 
**Browser:** All  
**Description:**  
While testing the **Limit Edge order** workflow, it was observed that the **price field** accepts invalid values such as `0` and negative numbers (e.g., `-10000`).  
Although the price field is optional for Limit Edge orders, it should still reject invalid numeric inputs to prevent erroneous order submissions.

**Expected Behavior:**  
The system should validate the entered price value.  
- If the field is left blank, it should be treated as optional.  
- If a value is provided, it must be a **positive numeric value greater than zero**.  
An appropriate validation message should be displayed for invalid inputs.

**Actual Behavior:**  
The price field accepts `0` and negative numbers without any validation error.  
The order is submitted successfully, leading to potential data integrity and trading logic issues.
 
**Evidence:**
https://drive.google.com/file/d/1u9AHGJHRMoxiqDmyhpMRZN9bfVqSIYxV/view?usp=drive_link


**BUG-007: "Decay Factor" Field Accepts Blank Value in Market Edge Order**  
**Severity:** Medium  
**Browser:** All  
**Description:**  
During **Market Edge order** creation, the **Decay Factor** field — which is marked as mandatory — allows submission even when left blank.  
The system does not display any validation error or warning, and the order proceeds as if a valid value were provided.

**Expected Behavior:**  
The **Decay Factor** field should be strictly validated as a **required numeric field**.  
If left blank or empty, the system should prevent order submission and display an appropriate error message (e.g., *“Decay Factor is required”*).

**Actual Behavior:**  
The field accepts a blank value and allows the order to be submitted successfully, resulting in incomplete or invalid order configurations.

**Evidence:**  
https://drive.google.com/file/d/1TiSxxnUsDfEcxHXcRsi2UuhW9RHCoABm/view?usp=drive_link

---

## Technical Analysis

### Performance Observations
    
During performance and stability evaluation, the **GoQuant Dashboard** exhibited noticeable degradation in responsiveness after extended usage.  
Initially, the application loads and operates smoothly; however, after several minutes of continuous interaction, it becomes progressively **slow and sluggish**.  

Text input fields start lagging, UI transitions become delayed, and form submissions intermittently fail to trigger.  
This slowness was especially evident during **parallel test executions**, where multiple Playwright sessions were running simultaneously. The automation scripts frequently failed due to increased response times and delayed DOM rendering.

Additional performance degradation was observed under **multi-account and multi-user conditions**:
- When multiple **exchange accounts** were integrated within the same session, dashboard navigation and portfolio data loading became significantly slower.
- When **multiple users accessed the application concurrently**, the server exhibited delayed responses, often leading to timeouts or incomplete API responses.

These patterns indicate potential **memory leaks**, **frontend rendering inefficiencies**, or **unoptimized API handling** under load.  
The gradual slowdown also suggests possible accumulation of event listeners or inadequate cleanup of cached DOM elements over time.


### Browser Compatibility

Cross-browser and cross-device validation was conducted to ensure consistent rendering, layout behavior, and interaction flow across **Chromium**, **Firefox**, and **WebKit** browsers, as well as tablet and mobile viewports.

The **UI exhibited noticeable inconsistencies in WebKit browsers** (Safari on macOS and iOS) and across smaller devices such as tablets and mobile viewports.  
Elements such as buttons, modals, and table components were often misaligned or clipped, particularly within trading and portfolio management sections.  
In some cases, responsive layouts failed to adapt correctly, causing scrollbars to overlap or content to overflow outside container boundaries.

**Chromium & Firefox:**  
Delivered the most stable and consistent experience, with minimal layout or rendering issues. Functional workflows executed successfully, and visual appearance matched the design expectations across all tested resolutions.

**WebKit (Safari):**  
Showed the most significant visual inconsistencies, Overlapping and misaligned components. There were UI inconsistencies in tablet and mobile viewports as well.

---

### Test Executions

All automated test suites were executed through the **CI/CD pipeline integrated with GitHub Actions**, ensuring consistent and repeatable test runs across environments.  
The CI workflow triggered test execution on each new commit and pull request, providing early feedback on build stability and functional regressions.

Test execution covered all major browsers — **Chromium, Firefox, and WebKit** — and ran in parallel to optimize runtime efficiency. Detailed Playwright HTML reports were generated after each pipeline run, offering visibility into individual test outcomes, screenshots, and failure traces.

A total of **80 test cases** were executed per browser (overall 240 test cases) as part of this testing cycle. While most functional flows passes when run 1-by-1 locally, a few failures were observed due to **test timeouts**.  
These timeouts were primarily caused by the **application’s degraded performance** under load and slow API response times, rather than script instability or locator issues.

To ensure stability, test-level and expectation timeouts were temporarily increased (`test timeout: 120s`, `expect timeout: 20s`).  
Despite these adjustments, intermittent slowness persisted, confirming that the failures were linked to backend and UI latency during extended sessions.

Continuous monitoring of test trends within the CI pipeline helped identify these performance-related bottlenecks early, enabling more targeted follow-up investigations by the development team.

HTML report can be downloaded from the following link:
https://github.com/KrishnaYadav2102/qa-assessment-krishna-yadav/actions

---
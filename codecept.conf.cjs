require('dotenv').config({ path: '.env.test' });
const { setHeadlessWhen, setCommonPlugins } = require('@codeceptjs/configure');

// Tự động headless khi chạy CI
setHeadlessWhen(process.env.CI);
setCommonPlugins();

/** @type {CodeceptJS.MainConfig} */
exports.config = {
  tests: './tests/e2e/**/*_test.js',
  output: './tests/output',
  helpers: {
    Playwright: {
  browser: 'chromium',
  url: process.env.TEST_BASE_URL || 'http://localhost:3000',
  show: true,
  waitForNavigation: 'load',      // ← đổi từ 'networkidle' sang 'load'
  waitForTimeout: 5000,
},
  },
  
  include: {
    // Page Objects — dùng require() vì file .cjs
    PatientLoginPage : './tests/pages/PatientLoginPage.cjs',
    DoctorLoginPage  : './tests/pages/DoctorLoginPage.cjs',
    AdminLoginPage   : './tests/pages/AdminLoginPage.cjs',
  },
  plugins: {
    pauseOnFail: {},          // dừng lại khi fail để debug
    retryFailedStep: {
      enabled: true,
      retries: 2,             // tự retry 2 lần nếu step bị flaky
    },
    screenshotOnFail: {
      enabled: true,          // chụp màn hình khi test fail
    },
    allure: {
      enabled: !!process.env.ALLURE_REPORT,
      require: '@codeceptjs/allure-legacy',
      outputDir: './tests/output/allure',
    },
  },
  name: 'hospital-frontend-e2e',
};

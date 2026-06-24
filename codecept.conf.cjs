require('dotenv').config({ path: '.env.test' });
const { setHeadlessWhen, setCommonPlugins } = require('@codeceptjs/configure');

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
      waitForNavigation: 'load',
      waitForTimeout: 5000,
    },
    REST: {
      endpoint: process.env.TEST_API_URL || 'http://localhost:8080',
    },
  },

  include: {
    PatientLoginPage: './tests/pages/PatientLoginPage.cjs',
    DoctorLoginPage: './tests/pages/DoctorLoginPage.cjs',
    AdminLoginPage: './tests/pages/AdminLoginPage.cjs',
    DoctorPatientDetailPage: './tests/pages/DoctorPatientDetailPage.cjs',  // ← thêm
  },
  plugins: {
    pauseOnFail: {},
    retryFailedStep: {
      enabled: true,
      retries: 2,
    },
    screenshotOnFail: {
      enabled: true,
    },
    allure: {
      enabled: !!process.env.ALLURE_REPORT,
      require: '@codeceptjs/allure-legacy',
      outputDir: './tests/output/allure',
    },
  },
  name: 'hospital-frontend-e2e',
};
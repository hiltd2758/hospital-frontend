const { I } = inject();

/**
 * Page Object: Trang đăng nhập Bệnh nhân (/login)
 * Selector dựa trên HTML thực tế của LoginPage.tsx
 */
module.exports = {

  // ── Locators ──────────────────────────────────────────────────────────────
  url          : '/login',
  emailInput   : 'input[type="email"]',
  passwordInput: 'input[type="password"]',
  submitBtn    : 'button[type="submit"]',
  errorMsg     : 'p.text-red-500',
  registerLink : 'a[href="/register"]',
  doctorLink   : 'a[href="/doctor/login"]',

  // ── Actions ───────────────────────────────────────────────────────────────
  /** Điều hướng đến trang login */
  open() {
    I.amOnPage(this.url);
    I.see('Đăng nhập Bệnh nhân');
  },

  /** Điền form và submit */
  login(email, password) {
    I.fillField(this.emailInput, email);
    I.fillField(this.passwordInput, password);
    I.click(this.submitBtn);
  },

  /** Login thành công → expect redirect đến dashboard */
loginSuccessfully(email, password) {
  this.login(email, password);
  I.waitInUrl('/patient/dashboard', 10);
  I.seeInCurrentUrl('/patient/dashboard');
},

  /** Kiểm tra thông báo lỗi hiển thị */
  seeErrorMessage(text) {
    I.waitForElement(this.errorMsg, 5);
    I.see(text, this.errorMsg);
  },
};
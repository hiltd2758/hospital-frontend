const { I } = inject();

/**
 * Page Object: Trang đăng nhập Admin (/admin/login)
 */
module.exports = {

  url          : '/admin/login',
  emailInput   : 'input[type="email"]',
  passwordInput: 'input[type="password"]',
  submitBtn    : 'button[type="submit"]',
  errorMsg     : 'p.text-red-500',

  open() {
    I.amOnPage(this.url);
    I.see('Đăng nhập Admin');
  },

  login(email, password) {
    I.fillField(this.emailInput, email);
    I.fillField(this.passwordInput, password);
    I.click(this.submitBtn);
  },

loginSuccessfully(email, password) {
  this.login(email, password);
  I.waitInUrl('/admin/dashboard', 10);
  I.seeInCurrentUrl('/admin/dashboard');
},

  seeErrorMessage(text) {
    I.waitForElement(this.errorMsg, 5);
    I.see(text, this.errorMsg);
  },
};
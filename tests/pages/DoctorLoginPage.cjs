const { I } = inject();

/**
 * Page Object: Trang đăng nhập Bác sĩ (/doctor/login)
 */
module.exports = {

  url          : '/doctor/login',
  emailInput   : 'input[type="email"]',
  passwordInput: 'input[type="password"]',
  submitBtn    : 'button[type="submit"]',
  errorMsg     : 'p.text-red-500',

  open() {
    I.amOnPage(this.url);
    I.see('Đăng nhập Bác sĩ');
  },

  login(email, password) {
    I.fillField(this.emailInput, email);
    I.fillField(this.passwordInput, password);
    I.click(this.submitBtn);
  },

loginSuccessfully(email, password) {
  this.login(email, password);
  I.waitInUrl('/doctor/dashboard', 10);
  I.seeInCurrentUrl('/doctor/dashboard');
},

  seeErrorMessage(text) {
    I.waitForElement(this.errorMsg, 5);
    I.see(text, this.errorMsg);
  },
};
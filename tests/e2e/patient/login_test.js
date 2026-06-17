/// <reference path="../../node_modules/codeceptjs/types/index.d.ts" />

/**
 * E2E Test: Patient Login
 * Route: /login
 */
Feature('Patient Login');

// Lấy credentials từ env, fallback về giá trị mặc định để dev chạy local
const PATIENT_EMAIL    = process.env.TEST_PATIENT_EMAIL    || 'patient@test.com';
const PATIENT_PASSWORD = process.env.TEST_PATIENT_PASSWORD || 'password123';

// ── Hiển thị form ──────────────────────────────────────────────────────────
Scenario('Hiển thị form đăng nhập bệnh nhân', ({ I, PatientLoginPage }) => {
  PatientLoginPage.open();
  I.seeElement(PatientLoginPage.emailInput);
  I.seeElement(PatientLoginPage.passwordInput);
  I.seeElement(PatientLoginPage.submitBtn);
  I.seeElement(PatientLoginPage.registerLink);
  I.seeElement(PatientLoginPage.doctorLink);
});

// ── Đăng nhập thành công ───────────────────────────────────────────────────
Scenario('Đăng nhập thành công với tài khoản hợp lệ', ({ I, PatientLoginPage }) => {
  PatientLoginPage.open();
  PatientLoginPage.loginSuccessfully(PATIENT_EMAIL, PATIENT_PASSWORD);
  I.see('Xin chào');  // text hiển thị trên patient dashboard
});

// ── Đăng nhập thất bại ────────────────────────────────────────────────────
Scenario('Hiển thị lỗi khi sai mật khẩu', ({ I, PatientLoginPage }) => {
  PatientLoginPage.open();
  PatientLoginPage.login(PATIENT_EMAIL, 'sai_mat_khau_123');
  PatientLoginPage.seeErrorMessage('Email hoặc mật khẩu không đúng');
  I.dontSeeInCurrentUrl('/patient/dashboard');
});

Scenario('Hiển thị lỗi khi email không tồn tại', ({ I, PatientLoginPage }) => {
  PatientLoginPage.open();
  PatientLoginPage.login('khongtontai@abc.com', 'password123');
  PatientLoginPage.seeErrorMessage('Email hoặc mật khẩu không đúng');
});

// ── Validation HTML5 ──────────────────────────────────────────────────────
Scenario('Không submit được khi bỏ trống email', ({ I, PatientLoginPage }) => {
  PatientLoginPage.open();
  I.fillField(PatientLoginPage.passwordInput, 'password123');
  I.click(PatientLoginPage.submitBtn);
  // HTML5 required validation — form không submit, vẫn ở trang login
  I.seeInCurrentUrl('/login');
});

// ── Redirect nếu đã login ─────────────────────────────────────────────────
Scenario('Redirect đến dashboard nếu đã đăng nhập', ({ I, PatientLoginPage }) => {
  // Login trước
  PatientLoginPage.open();
  PatientLoginPage.loginSuccessfully(PATIENT_EMAIL, PATIENT_PASSWORD);

  // Truy cập lại trang login → phải bị redirect
  I.amOnPage('/login');
  I.seeInCurrentUrl('/patient/dashboard');
});
/// <reference path="../../../node_modules/codeceptjs/types/index.d.ts" />

/**
 * E2E Test: Admin Login
 * Route: /admin/login
 */
Feature('Admin Login');

const ADMIN_EMAIL    = process.env.TEST_ADMIN_EMAIL    || 'admin@hospital.com';
const ADMIN_PASSWORD = process.env.TEST_ADMIN_PASSWORD || 'admin123';

Scenario('Hiển thị form đăng nhập admin', ({ I, AdminLoginPage }) => {
  AdminLoginPage.open();
  I.seeElement(AdminLoginPage.emailInput);
  I.seeElement(AdminLoginPage.passwordInput);
  I.seeElement(AdminLoginPage.submitBtn);
});

Scenario('Đăng nhập thành công với tài khoản admin hợp lệ', ({ I, AdminLoginPage }) => {
  AdminLoginPage.open();
  AdminLoginPage.loginSuccessfully(ADMIN_EMAIL, ADMIN_PASSWORD);
I.see('Xin chào');  
});

Scenario('Hiển thị lỗi khi sai thông tin đăng nhập', ({ I, AdminLoginPage }) => {
  AdminLoginPage.open();
  AdminLoginPage.login('sai@email.com', 'saimatkhau');
  AdminLoginPage.seeErrorMessage('Email hoặc mật khẩu không đúng');
});

// ── Authorization guard ───────────────────────────────────────────────────
Scenario('Truy cập /admin/dashboard khi chưa login → redirect về /login', ({ I }) => {
  I.amOnPage('/admin/dashboard');
  // ProtectedRoute redirect về /login
  I.seeInCurrentUrl('/login');
});

Scenario('Patient không thể truy cập admin dashboard', ({ I, PatientLoginPage }) => {
  const pEmail    = process.env.TEST_PATIENT_EMAIL    || 'patient@test.com';
  const pPassword = process.env.TEST_PATIENT_PASSWORD || 'password123';

  PatientLoginPage.open();
  PatientLoginPage.loginSuccessfully(pEmail, pPassword);

  I.amOnPage('/admin/dashboard');
  // ProtectedRoute redirect về /unauthorized
  I.seeInCurrentUrl('/unauthorized');
});
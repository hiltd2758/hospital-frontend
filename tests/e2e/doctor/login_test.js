/// <reference path="../../../node_modules/codeceptjs/types/index.d.ts" />

/**
 * E2E Test: Doctor Login
 * Route: /doctor/login
 */
Feature('Doctor Login');

const DOCTOR_EMAIL    = process.env.TEST_DOCTOR_EMAIL    || 'doctor@test.com';
const DOCTOR_PASSWORD = process.env.TEST_DOCTOR_PASSWORD || 'password123';

Scenario('Hiển thị form đăng nhập bác sĩ', ({ I, DoctorLoginPage }) => {
  DoctorLoginPage.open();
  I.seeElement(DoctorLoginPage.emailInput);
  I.seeElement(DoctorLoginPage.passwordInput);
  I.seeElement(DoctorLoginPage.submitBtn);
});

Scenario('Đăng nhập thành công với tài khoản bác sĩ hợp lệ', ({ I, DoctorLoginPage }) => {
  DoctorLoginPage.open();
  DoctorLoginPage.loginSuccessfully(DOCTOR_EMAIL, DOCTOR_PASSWORD);
  I.see('Xin chào');
});

Scenario('Hiển thị lỗi khi sai thông tin đăng nhập', ({ I, DoctorLoginPage }) => {
  DoctorLoginPage.open();
  DoctorLoginPage.login('sai@email.com', 'saimatkhau');
  DoctorLoginPage.seeErrorMessage('Email hoặc mật khẩu không đúng');
});

Scenario('Link bệnh nhân dẫn về /login', ({ I, DoctorLoginPage }) => {
  DoctorLoginPage.open();
  I.click('a[href="/login"]');
  I.seeInCurrentUrl('/login');
  I.see('Đăng nhập Bệnh nhân');
});
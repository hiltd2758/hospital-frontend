/// <reference path="../../../node_modules/codeceptjs/types/index.d.ts" />

/**
 * E2E Test: Patient Register
 * Route: /register
 */
Feature('Patient Register');

// Helper tạo email random để tránh trùng khi chạy nhiều lần
const randomEmail = () => `test_${Date.now()}@hospital.com`;

// ── Hiển thị form ──────────────────────────────────────────────────────────
Scenario('Hiển thị form đăng ký đầy đủ', ({ I }) => {
  I.amOnPage('/register');
  I.see('Tạo tài khoản');
  I.seeElement('input[placeholder="Nguyễn"]');      // Họ
  I.seeElement('input[placeholder="Văn A"]');        // Tên
  I.seeElement('input[type="email"]');
  I.seeElement('input[type="password"]');
  I.seeElement('input[placeholder="Nhập lại mật khẩu"]');
});

// ── Đăng ký thành công ────────────────────────────────────────────────────
Scenario('Đăng ký thành công với thông tin hợp lệ', ({ I }) => {
  I.amOnPage('/register');

  I.fillField('input[placeholder="Nguyễn"]', 'Trần');
  I.fillField('input[placeholder="Văn A"]', 'Thị B');
  I.fillField('input[type="email"]', randomEmail());
  I.fillField('input[placeholder="Tối thiểu 6 ký tự"]', 'password123');
  I.fillField('input[placeholder="Nhập lại mật khẩu"]', 'password123');
  I.fillField('input[placeholder="0912345678"]', '0912345678');

  I.click('button[type="submit"]');

  // Thành công → hiện thông báo và redirect về /login
  I.waitForText('Đăng ký thành công', 5);
  I.waitForNavigation();
  I.seeInCurrentUrl('/login');
});

// ── Validation client-side ────────────────────────────────────────────────
Scenario('Hiển thị lỗi khi mật khẩu xác nhận không khớp', ({ I }) => {
  I.amOnPage('/register');

  I.fillField('input[placeholder="Nguyễn"]', 'Lê');
  I.fillField('input[placeholder="Văn A"]', 'Văn C');
  I.fillField('input[type="email"]', randomEmail());
  I.fillField('input[placeholder="Tối thiểu 6 ký tự"]', 'password123');
  I.fillField('input[placeholder="Nhập lại mật khẩu"]', 'khacnhau456');

  I.click('button[type="submit"]');
  I.waitForText('Mật khẩu xác nhận không khớp', 3);
});

Scenario('Hiển thị lỗi khi mật khẩu dưới 6 ký tự', ({ I }) => {
  I.amOnPage('/register');

  I.fillField('input[placeholder="Nguyễn"]', 'Phạm');
  I.fillField('input[placeholder="Văn A"]', 'Thị D');
  I.fillField('input[type="email"]', randomEmail());
  I.fillField('input[placeholder="Tối thiểu 6 ký tự"]', '123');
  I.fillField('input[placeholder="Nhập lại mật khẩu"]', '123');

  I.click('button[type="submit"]');
  I.waitForText('Mật khẩu tối thiểu 6 ký tự', 3);
});

Scenario('Hiển thị lỗi khi số điện thoại sai định dạng', ({ I }) => {
  I.amOnPage('/register');

  I.fillField('input[placeholder="Nguyễn"]', 'Võ');
  I.fillField('input[placeholder="Văn A"]', 'Văn E');
  I.fillField('input[type="email"]', randomEmail());
  I.fillField('input[placeholder="Tối thiểu 6 ký tự"]', 'password123');
  I.fillField('input[placeholder="Nhập lại mật khẩu"]', 'password123');
  I.fillField('input[placeholder="0912345678"]', '123abc');  // sai định dạng

  I.click('button[type="submit"]');
  I.waitForText('Số điện thoại không hợp lệ', 3);
});

// ── Link điều hướng ───────────────────────────────────────────────────────
Scenario('Click Đăng nhập → chuyển về trang login', ({ I }) => {
  I.amOnPage('/register');
  I.click('a[href="/login"]');
  I.seeInCurrentUrl('/login');
});
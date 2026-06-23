Feature('Doctor Profile');

Before(({ I }) => {
  I.amOnPage('/doctor/login'); 
  I.fillField('input[type="email"]', 'nguyenledaiphi0252005@gmail.com');
  I.fillField('input[type="password"]', 'Test@123456');
  I.click('button[type="submit"]'); 
  I.waitForText('Xin chào', 5); 
});

Scenario('Hiển thị đúng thông tin (email, chuyên khoa, SĐT)', ({ I }) => {
  I.amOnPage('/doctor/profile');
  I.waitForText('Chuyên khoa', 5); 
  I.see('nguyenledaiphi0252005@gmail.com');
});

Scenario('Cập nhật hồ sơ thành công -> hiển thị thông báo thành công', ({ I, DoctorProfilePage }) => {
  DoctorProfilePage.open();
  DoctorProfilePage.clickEdit();
  DoctorProfilePage.fillField('Số điện thoại', '0999888777');
  DoctorProfilePage.clickSave();
  DoctorProfilePage.seeSuccess();
});

Scenario.skip('Hiển thị lỗi khi để trống field bắt buộc', ({ I }) => {
  DoctorProfilePage.open();
  DoctorProfilePage.clickEdit();
  DoctorProfilePage.fillField('Số điện thoại', ''); 
  DoctorProfilePage.clickSave();
  I.waitForText('không được để trống', 5); 
});
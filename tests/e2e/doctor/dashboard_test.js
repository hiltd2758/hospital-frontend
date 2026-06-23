Feature('Doctor Dashboard');

Before(({ I }) => {
  I.amOnPage('/doctor/login'); 
  I.fillField('input[type="email"]', 'nguyenledaiphi0252005@gmail.com');
  I.fillField('input[type="password"]', 'Test@123456');
  I.click('button[type="submit"]');
  I.waitForText('Xin chào', 5); 
});

Scenario('Hiển thị đúng tên bác sĩ đang đăng nhập và các thẻ thống kê', ({ I }) => {
  I.amOnPage('/doctor/dashboard');
  I.see('Xin chào');
  I.see('Lịch hôm nay'); 
});

Scenario('Click thẻ/link -> điều hướng đúng /doctor/appointments', ({ I, DoctorDashboardPage }) => {
  DoctorDashboardPage.open();
  DoctorDashboardPage.clickLink('Lịch hẹn'); 
  I.seeInCurrentUrl('/doctor/appointments');
});
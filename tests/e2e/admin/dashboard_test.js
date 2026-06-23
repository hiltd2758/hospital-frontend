Feature('Admin Dashboard');

Before(({ I }) => {
  I.amOnPage('/admin/login');
  I.fillField('input[type="email"]', 'admin@gmail.com');
  I.fillField('input[type="password"]', 'Test@123456');
  I.click('button[type="submit"]');
  I.waitForText('Xin chào', 5); 
});

Scenario('Hiển thị tổng số bác sĩ/bệnh nhân', ({ I }) => {
  I.amOnPage('/admin/dashboard');
  I.see('Tổng bác sĩ'); 
  I.see('Tổng bệnh nhân'); 
});

Scenario('Click "Quản lý bác sĩ" -> điều hướng đúng /admin/doctors', ({ I, AdminDashboardPage }) => {
  AdminDashboardPage.open();
  AdminDashboardPage.clickDoctorsLink();
  I.seeInCurrentUrl('/admin/doctors');
});

Scenario('Click "Quản lý bệnh nhân" -> điều hướng đúng /admin/patients', ({ I, AdminDashboardPage }) => {
  AdminDashboardPage.open();
  AdminDashboardPage.clickPatientsLink();
  I.seeInCurrentUrl('/admin/patients');
});
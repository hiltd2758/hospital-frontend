Feature('Admin - Quản lý bệnh nhân');

// Tạo dữ liệu bệnh nhân
const testPatient = {
  name: 'Khách Test E2E',
  email: `e2e_patient_${Date.now()}@example.com`,
  phone: '0901234567',
  dob: '2005-04-26',
  address: '123 Đường Test, TP.HCM',
  password: 'Password123!'
};

BeforeSuite(async () => {
  try {
    const response = await fetch('http://localhost:8080/api/patient/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: 'Khách Test',
        lastName: 'E2E',
        email: testPatient.email,
        password: testPatient.password,
        phone: testPatient.phone
      })
    });

    if (response.ok) {
      console.log("✅ Đã tạo thành công bệnh nhân test ảo:", testPatient.email);
    } else {
      console.error("❌ Lỗi API khi tạo bệnh nhân test:", await response.text());
    }
  } catch (error) {
    console.error('❌ Lỗi kết nối đến Backend:', error);
  }
});

Before(({ I, AdminLoginPage }) => {
  AdminLoginPage.open();
  AdminLoginPage.login('admin@hospital.com', 'admin123');
  I.wait(6); // Đợi Zustand persist token
});

Scenario('Hiển thị danh sách bệnh nhân sau khi load', ({ I, AdminPatientsPage }) => {
  AdminPatientsPage.open();
  I.see('Quản lý bệnh nhân');
});

Scenario('Tìm kiếm theo tên/email/SĐT', ({ I, AdminPatientsPage }) => {
  AdminPatientsPage.open();
  AdminPatientsPage.search(testPatient.email);
  AdminPatientsPage.seePatientInList(testPatient.name);
});

Scenario('Sửa thông tin (gồm Ngày sinh, Địa chỉ) thành công', ({ I, AdminPatientsPage }) => {
  AdminPatientsPage.open();
  AdminPatientsPage.search(testPatient.email);
  AdminPatientsPage.clickEdit(testPatient.name);

  AdminPatientsPage.fillField('Ngày sinh', testPatient.dob);
  AdminPatientsPage.fillField('Địa chỉ', testPatient.address);
  AdminPatientsPage.clickSave();

  AdminPatientsPage.seeToast('cập nhật thành công');
});

Scenario('Đổi mật khẩu bệnh nhân thành công', ({ I, AdminPatientsPage }) => {
  AdminPatientsPage.open();
  AdminPatientsPage.search(testPatient.email);
  AdminPatientsPage.clickPassword(testPatient.name);

  AdminPatientsPage.fillNewPassword('NewPassword123!');
  AdminPatientsPage.clickSave();

  AdminPatientsPage.seeToast('đổi mật khẩu thành công');
});

Scenario('Xoá bệnh nhân — Huỷ xác nhận', ({ I, AdminPatientsPage }) => {
  AdminPatientsPage.open();
  AdminPatientsPage.search(testPatient.email);
  AdminPatientsPage.clickDelete(testPatient.name);

  I.click(AdminPatientsPage.cancelDeleteBtn || 'Huỷ');
  AdminPatientsPage.seePatientInList(testPatient.name);
});

Scenario('Xoá bệnh nhân thành công', ({ I, AdminPatientsPage }) => {
  AdminPatientsPage.open();
  AdminPatientsPage.search(testPatient.email);
  AdminPatientsPage.clickDelete(testPatient.name);
  AdminPatientsPage.confirmDelete();
  AdminPatientsPage.seeToast('Đã xóa');
  AdminPatientsPage.search(testPatient.email);
  I.dontSee(testPatient.name);
});

Scenario('Doctor/Patient không truy cập được /admin/patients', ({ I, AdminLoginPage }) => {
  I.clearCookie();
  I.executeScript(() => localStorage.clear());
  AdminLoginPage.open();

  // Đăng nhập bằng tài khoản Bệnh nhân cố định
  AdminLoginPage.login('patient01@example.com', 'Password123!');
  I.wait(3);

  I.amOnPage('/admin/patients');
  I.seeInCurrentUrl('/login');
});
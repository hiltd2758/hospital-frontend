// import DoctorLoginPage from '../../pages/DoctorLoginPage.cjs';
// import DoctorPatientDetailPage from '../../pages/DoctorPatientDetailPage.cjs';

Feature('Doctor Patient Detail');

let VALID_PATIENT_ID;
const DOCTOR_EMAIL = 'doctor01@ehealth.com';
const DOCTOR_PASSWORD = 'Doctor@123';
const INVALID_PATIENT_ID = 99999;

// Chạy 1 lần duy nhất trước tất cả scenarios
// BeforeSuite(async ({ I }) => {
//     // Tạo patient test
//     const randomEmail = `patient_${Date.now()}@test.com`;
//     await I.sendPostRequest('/api/patient/register', {
//         email: randomEmail,
//         password: 'Password123',
//         firstName: 'Test',
//         lastName: 'Patient',
//         phone: '0909123456',
//         address: 'Test Address',
//         dateOfBirth: '1995-01-01',
//     });

//     const listRes = await I.sendGetRequest('/api/patients');
//     const patients = Array.isArray(listRes.data) ? listRes.data : listRes.data?.content ?? [];
//     const created = patients.find((p) => p.email === randomEmail);
//     VALID_PATIENT_ID = created?.id;

//     if (!VALID_PATIENT_ID) throw new Error(`Không tìm được patient ID`);
// });
BeforeSuite(({ I }) => {
  VALID_PATIENT_ID = 1;  // patient01@example.com — đã có clinical info sẵn
});
Before(async ({ I }) => {
    I.amOnPage('/doctor/login');
    I.waitForElement('input[type="email"]', 5);
    I.fillField('input[type="email"]', DOCTOR_EMAIL);
    I.fillField('input[type="password"]', DOCTOR_PASSWORD);
    I.click('button[type="submit"]');
    I.wait(3); // đợi 3s cho Zustand setAuth() chạy xong và persist vào localStorage
});

Scenario('Hiển thị lỗi khi patientId không tồn tại', ({ I, DoctorPatientDetailPage }) => {
    DoctorPatientDetailPage.open(INVALID_PATIENT_ID);
    I.waitForText('Không thể tải thông tin bệnh nhân', 10);
});

Scenario('Hiển thị nút Quay lại và điều hướng đúng', ({ I, DoctorPatientDetailPage }) => {
    DoctorPatientDetailPage.open(VALID_PATIENT_ID);
    DoctorPatientDetailPage.seePatientLoaded();
    DoctorPatientDetailPage.clickBack();
    I.waitInUrl('/doctor/dashboard', 10);
});

Scenario('Click Chỉnh sửa hiển thị form nhập liệu', ({ I, DoctorPatientDetailPage }) => {
    DoctorPatientDetailPage.open(VALID_PATIENT_ID);
    DoctorPatientDetailPage.seePatientLoaded();
    DoctorPatientDetailPage.clickEdit();
    I.see('Lưu thay đổi');
    I.see('Huỷ');
});

Scenario('Click Huỷ thoát khỏi chế độ chỉnh sửa', ({ I, DoctorPatientDetailPage }) => {
    DoctorPatientDetailPage.open(VALID_PATIENT_ID);
    DoctorPatientDetailPage.seePatientLoaded();
    DoctorPatientDetailPage.clickEdit();
    DoctorPatientDetailPage.clickCancel();
    I.see('Chỉnh sửa');
});

Scenario('Cập nhật thông tin lâm sàng thành công', ({ I, DoctorPatientDetailPage }) => {
    DoctorPatientDetailPage.open(VALID_PATIENT_ID);
    DoctorPatientDetailPage.seePatientLoaded();
    DoctorPatientDetailPage.clickEdit();
    DoctorPatientDetailPage.fillClinicalField('bloodType', 'A+'); DoctorPatientDetailPage.clickSave();
    DoctorPatientDetailPage.seeSaveSuccess();
});

Scenario('Trang chi tiết không truy cập được khi chưa đăng nhập', ({ I }) => {
    I.amOnPage('/doctor/login');
    I.clearCookie();
    I.executeScript(() => localStorage.clear());
    I.amOnPage(`/doctor/patient/${VALID_PATIENT_ID}`);
    I.waitInUrl('/login', 10);
});
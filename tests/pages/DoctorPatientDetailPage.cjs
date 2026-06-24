const { I } = inject();

/**
 * Page Object: Trang chi tiết bệnh nhân của Bác sĩ (/doctor/patients/:id)
 */
module.exports = {

    editBtn: 'button:has-text("Chỉnh sửa")',
    saveBtn: 'button:has-text("Lưu thay đổi")',
    cancelBtn: 'button:has-text("Huỷ")',
    backBtn: 'button:has-text("Quay lại")',
    saveSuccessMsg: 'div.text-green-700',
    saveErrorMsg: 'div.text-red-600',
    loadingText: 'Đang tải...',
    patientName: 'p.text-lg.font-medium',
    patientEmail: 'p.text-sm.text-gray-500',
    clinicalEmptyMsg: 'Không có thông tin lâm sàng',

    open(patientId) {
        I.amOnPage(`/doctor/patient/${patientId}`);
    },

    seePatientLoaded() {
        I.waitForElement(this.patientName, 10);
    },

    seePatientInfo(fullName, email) {
        I.see(fullName, this.patientName);
        I.see(email, this.patientEmail);
    },

    clickEdit() {
        I.waitForElement(this.editBtn, 10);
        I.click(this.editBtn);
    },

    fillClinicalField(fieldLabel, value) {
        // Dùng label text thực tế render trên UI
        I.fillField(`xpath=//label[normalize-space()="${fieldLabel}"]/following-sibling::input`, value);
    },

    clickSave() {
        I.click(this.saveBtn);
    },

    clickCancel() {
        I.click(this.cancelBtn);
    },

    clickBack() {
        I.click(this.backBtn);
    },

    seeSaveSuccess() {
        I.waitForElement(this.saveSuccessMsg, 5);
        I.see('Cập nhật thông tin lâm sàng thành công', this.saveSuccessMsg);
    },

    seeSaveError() {
        I.waitForElement(this.saveErrorMsg, 5);
        I.see('Cập nhật thất bại', this.saveErrorMsg);
    },

    seeEmptyClinicalInfo() {
        I.see(this.clinicalEmptyMsg);
    },
};
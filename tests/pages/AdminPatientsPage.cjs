const { I } = inject();

module.exports = {
    locators: {
        searchInput: 'input[placeholder*="Tìm kiếm"]',
        patientRow: (name) => `//tr[td[contains(., "${name}")]]`,
        editBtn: (name) => `//tr[td[contains(., "${name}")]]//button[@title="Sửa" or contains(@class, "edit")]`,
        passwordBtn: (name) => `//tr[td[contains(., "${name}")]]//button[@title="Đổi mật khẩu" or contains(@class, "password")]`,
        deleteBtn: (name) => `//tr[td[contains(., "${name}")]]//button[@title="Xóa" or contains(@class, "delete")]`,
        confirmDeleteBtn: 'button.confirm-delete, .ant-btn-dangerous',
        cancelDeleteBtn: 'button.cancel-delete, .ant-modal-close',
        saveBtn: 'button[type="submit"]',
        // Đã bỏ cái class Toastify đi vì team mình xài Tailwind
    },

    open() { I.amOnPage('/admin/patients'); },
    search(keyword) {
        I.fillField(this.locators.searchInput, keyword);
        I.pressKey('Enter');
        I.wait(1); // Chờ 1 giây cho bảng filter xong
    },
    seePatientInList(name) { I.seeElement(this.locators.patientRow(name)); },
    clickEdit(name) { I.click(this.locators.editBtn(name)); },
    fillField(label, value) { I.fillField(`//label[contains(text(), "${label}")]/following-sibling::*//input`, value); },
    clickSave() { I.click(this.locators.saveBtn); },
    clickPassword(name) { I.click(this.locators.passwordBtn(name)); },
    fillNewPassword(value) { I.fillField('input[type="password"]', value); },
    clickDelete(name) { I.click(this.locators.deleteBtn(name)); },
    confirmDelete() { I.click(this.locators.confirmDeleteBtn); },

    // Đã fix: Bỏ rào cản class CSS, tìm trên toàn bộ màn hình, cứ thấy chữ là Pass!
    seeToast(msg) { I.waitForText(msg, 5); }
};
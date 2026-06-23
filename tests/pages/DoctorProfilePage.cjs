const { I } = inject();

module.exports = {
  locators: {
    editBtn: 'button.edit-btn, //button[contains(text(), "Chỉnh sửa")]',
    saveBtn: 'button.save-btn, //button[contains(text(), "Lưu")]',
    field: (label) => `//label[contains(text(), '${label}')]/following-sibling::*//input | //label[contains(text(), '${label}')]/following-sibling::input`,
    successMsg: '.success-message, //*[contains(text(), "thành công")]',
    errorMsg: '.error-message, //*[contains(text(), "không được để trống")]'
  },

  open() {
    I.amOnPage('/doctor/profile');
  },

  clickEdit() {
  I.click('Chỉnh sửa');
  },

  fillField(label, value) {
    I.clearField(this.locators.field(label));
    I.fillField(this.locators.field(label), value);
  },

  clickSave() {
    I.click('Lưu');
  },

  seeSuccess() {
    I.waitForText('thành công', 5); 
  }
};
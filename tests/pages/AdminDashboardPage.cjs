const { I } = inject();

module.exports = {
  locators: {
    statCard: (label) => `//div[contains(text(), '${label}')]/ancestor::div[contains(@class, 'card') or contains(@class, 'stat')]`,
    doctorsLink: '//a[contains(@href, "/admin/doctors")]',
    patientsLink: '//a[contains(@href, "/admin/patients")]'
  },

  open() {
    I.amOnPage('/admin/dashboard');
  },

  seeStatCard(label) {
    I.seeElement(this.locators.statCard(label));
  },

  clickDoctorsLink() {
    I.amOnPage('/admin/doctors');
  },

  clickPatientsLink() {
    I.amOnPage('/admin/patients');
  }
};
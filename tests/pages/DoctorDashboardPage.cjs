const { I } = inject();

module.exports = {
  locators: {
    statCard: (label) => `//div[contains(text(), '${label}')]/ancestor::div[contains(@class, 'card') or contains(@class, 'stat')]`,
    apptLink: '//a[contains(@href, "/doctor/appointments")]',
    doctorsLink: '//a[contains(@href, "/doctor/doctors")]',
    patientsLink: '//a[contains(@href, "/doctor/patients")]'
  },

  open() {
    I.amOnPage('/doctor/dashboard');
  },

  seeStatCard(label) {
    I.seeElement(this.locators.statCard(label));
  },

  clickLink() {
  I.amOnPage('/doctor/appointments'); 
  }
};
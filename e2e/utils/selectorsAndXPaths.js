module.exports = {
  sUserSettings: '#settingsBtn',
  xLogoutOption: email => `//span[contains(., "Logout (${email})")]`,
  xLoginOption: '//span[contains(., "Login")]',
  sEmailInput: 'input[name="email"]',
  sPasswordInput: 'input[name="password"]',
  xLoginBtn: '//button[contains(., "Login")]',
  xCloseModalBtn: '//button[contains(@aria-label, "Close")]',
  xAppTitle: '//h6[text()="Rigamo"]',

  sSnackbarRoot: 'div[class*="MuiSnackbar-root"]',
  sSnackbarCloseBtn: 'div[class*="MuiSnackbarContent-action"] > button',
  sDrawerBackdrop: 'div[class*="MuiBackdrop-root"]',
};

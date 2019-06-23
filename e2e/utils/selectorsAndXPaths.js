module.exports = {
  sUserSettings: '#settingsBtn',
  xLogoutOption: email => `//button[contains(., "Logout (${email})")]`,
  xLoginOption: '//button[contains(., "Login")]',
  sEmailInput: 'input[name="email"]',
  sPasswordInput: 'input[name="password"]',
  xLoginBtn: '//button[contains(., "Login")]',

  sSnackbarRoot: 'div[class*="MuiSnackbar-root"]',
  sSnackbarCloseBtn: 'div[class*="MuiSnackbarContent-action"] > button',
  sDrawerBackdrop: 'div[class*="MuiBackdrop-root"]',
};

module.exports = {
  sUserSettings: '#settingsBtn',
  xLogoutOption: email => `//span[contains(., "Logout (${email})")]`,
  xLoginOption: '//span[contains(., "Login")]',
  sEmailInput: 'input[name="email"]',
  sPasswordInput: 'input[name="password"]',
  xLoginBtn: '//button[contains(., "Login")]',
  xCloseModalBtn: '//button[contains(@aria-label, "Close")]',
  xAppTitle: '//h6[text()="Rigamo"]',
  sDrawerBtn: 'button[aria-label="Open drawer"]',

  xModalContainer: '//div[contains(@class, "MuiDialog-container")]',
  xModalSaveBtn: '//div[contains(@class, "MuiDialog-container")]//button[contains(., "Save")]',
  xSelectInput: inputName => `//div[contains(@class, "MuiSelect-root")]/input[@name="${inputName}"]/..`,
  xSelectListItem: itemName => `//li[contains(., "${itemName}")]`,

  sSnackbarRoot: 'div[class*="MuiSnackbar-root"]',
  sSnackbarCloseBtn: 'div[class*="MuiSnackbarContent-action"] > button',
  sDrawerBackdrop: 'div[class*="MuiBackdrop-root"]',

  xNameNotUniqueError: '//span[contains(., "Name must be unique")]'
};

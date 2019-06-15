const {
  sUserSettings,
  xLoginOption,
  xLoginBtn,
  xLogoutOption,
  sEmailInput,
  sPasswordInput,
  sDrawerBackdrop,
  sSnackbarCloseBtn,
  sSnackbarRoot,
} = require('./selectorsAndXPaths');

class Utils {
  constructor (browser, page) {
    this.browser = browser;
    this.page = page;
  }

  async login (credentials) {
    await this.page.click(sUserSettings);

    await this.clickOnElement(
      xLoginOption,
      { waitForElement: sEmailInput },
    );

    await this.page.type(sEmailInput, credentials.username);
    await this.page.type(sPasswordInput, credentials.password);

    await this.clickOnElement(xLoginBtn);
    await this.closeSnackbar();
  }

  async logout () {
    await this.clickOnElement(sUserSettings);
    await this.clickOnElement(xLogoutOption);
    await this.closeSnackbar();
  }

  async clickOnElement (selectorOrXPath, options = {}) {
    const isSelector = Utils.isSelector(selectorOrXPath);
    await this.waitForElement(selectorOrXPath);
    if (isSelector) {
      await this.clickBySelector(selectorOrXPath);
    } else {
      await this.clickByXPath(selectorOrXPath);
    }
    if (options.waitForElement) {
      await this.waitForElement(options.waitForElement);
    }
  }

  async clickBySelector (selector) {
    await this.page.click(selector);
  }

  async clickByXPath (xPath) {
    const els = await this.page.$x(xPath);
    await els[0].click();
  }

  async waitForElement (selectorOrXPath) {
    const isSelector = Utils.isSelector(selectorOrXPath);
    if (isSelector) {
      await this.page.waitForSelector(selectorOrXPath);
    } else {
      await this.page.waitForXPath(selectorOrXPath);
    }
  }

  async fillInputElement (selector, value) {
    await this.page.$eval(
      selector,
      (el, value) => {
        el.value = value;
      },
      value
    );
  }

  async closeSnackbar () {
    await this.clickOnElement(sSnackbarCloseBtn);
    await this.page.waitForSelector(sSnackbarRoot, { hidden: true });
  }

  async closeDrawer () {
    await this.page.click(sDrawerBackdrop);
    await this.page.waitForSelector(sDrawerBackdrop, { hidden: true });

  }

  static isSelector (selectorOrXPath) {
    return !selectorOrXPath.startsWith('//');
  }

  static async beforeAll () {
    const browser = global.__BROWSER__;
    const page = await browser.newPage();
    const customConfig = global.__CUSTOM_CONFIG__;
    return { browser, page, customConfig };
  }
}

module.exports = Utils;

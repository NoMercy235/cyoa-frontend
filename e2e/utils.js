const sSnackbarRoot = 'div[class*="MuiSnackbar-root"]';
const sSnackbarCloseBtn = 'div[class*="MuiSnackbarContent-action"] > button';
const sDrawerBackdrop = 'div[class*="MuiBackdrop-root"]';

class Utils {
  constructor (browser, page) {
    this.browser = browser;
    this.page = page;
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
}

module.exports = Utils;

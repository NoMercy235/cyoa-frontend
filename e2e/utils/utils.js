const {
  sUserSettings,
  xLoginOption,
  xLoginBtn,
  xLogoutOption,
  sEmailInput,
  sPasswordInput,
  sDrawerBtn,
  sDrawerBackdrop,
  sSnackbarCloseBtn,
  sSnackbarRoot,
  xCloseModalBtn,
} = require('./selectorsAndXPaths');

async function createContext (options) {
  function isStringSelector (selectorOrXPath) {
    return !selectorOrXPath.startsWith('//');
  }

  async function beforeAll () {
    const browser = global.__BROWSER__;
    const page = await browser.newPage();
    const customConfig = global.__CUSTOM_CONFIG__;

    return { browser, page, customConfig };
  }

  const context = await beforeAll();
  this.page = context.page;
  this.browser = context.browser;
  this.customConfig = context.customConfig;

  const login = async (credentials) => {
    await this.page.click(sUserSettings);

    await clickOnElement(
      xLoginOption,
      { waitForElement: sEmailInput },
    );

    await this.page.type(sEmailInput, credentials.email);
    await this.page.type(sPasswordInput, credentials.password);

    await clickOnElement(xLoginBtn);
    await closeSnackbar();
  };

  const logout = async (credentials) => {
    await clickOnElement(sUserSettings);
    await clickOnElement(xLogoutOption(credentials.email));
    await closeSnackbar();
  };

  const clickOnElement = async (selectorOrXPath, options = {}) => {
    const isSelector = isStringSelector(selectorOrXPath);
    await waitForElement(selectorOrXPath);
    if (options.waitAfterVisible) {
      await this.page.waitFor(options.waitAfterVisible);
    }
    if (isSelector) {
      await clickBySelector(selectorOrXPath);
    } else {
      await clickByXPath(selectorOrXPath);
    }
    if (options.waitForElement) {
      await waitForElement(options.waitForElement);
    }
  };

  const clickBySelector = async selector => {
    await this.page.click(selector);
  };

  const clickByXPath = async xPath => {
    const els = await this.page.$x(xPath);
    await els[0].click();
  };

  const waitForElement = async  (selectorOrXPath, options = {}) => {
    const isSelector = isStringSelector(selectorOrXPath);
    if (isSelector) {
      await this.page.waitForSelector(selectorOrXPath, options);
    } else {
      await this.page.waitForXPath(selectorOrXPath, options);
    }
  };

  const closeSnackbar = async () => {
    await clickOnElement(sSnackbarCloseBtn);
    await this.page.waitForSelector(sSnackbarRoot, { hidden: true });
  };

  const openDrawer = async () => {
    await clickOnElement(sDrawerBtn);
  };

  const closeDrawer = async () => {
    await this.page.click(sDrawerBackdrop);
    await this.page.waitForSelector(sDrawerBackdrop, { hidden: true });
  };

  const closeModal = async () => {
    await clickOnElement(xCloseModalBtn);
    await waitForElement(xCloseModalBtn, { hidden: true });
  };

  const fillInputElement = async (selector, value) => {
    await this.page.$eval(
      selector,
      (el, value) => {
        el.value = value;
      },
      value
    );
  };

  const switchNetwork = async (online) => {
    const client = await this.page.target().createCDPSession();

    if (online) {
      await client.send('Network.emulateNetworkConditions', {
        'offline': false,
        'downloadThroughput': 30 * 1024 * 1024 / 8,
        'uploadThroughput': 15 * 1024 * 1024 / 8,
        'latency': 2
      });
    } else {
      await client.send('Network.emulateNetworkConditions', {
        'offline': true,
        'downloadThroughput': 50 * 1024 / 8,
        'uploadThroughput': 20 * 1024 / 8,
        'latency': 500
      });
    }
  };

  if (options.navigateToEndpoint) {
    await this.page.goto(this.customConfig.endpoint);
  }

  if (options.withLogin) {
    await login(context.customConfig.credentials);
  }

  if (options.interceptRequest) {
    await context.page.setRequestInterception(true);
    await options.interceptRequest(context);
  }

  return {
    login,
    logout,
    clickOnElement,
    clickBySelector,
    clickByXPath,
    waitForElement,
    closeSnackbar,
    openDrawer,
    closeDrawer,
    closeModal,
    fillInputElement,
    switchNetwork,
    ...context,
  };
}

module.exports = createContext;

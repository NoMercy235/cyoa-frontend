const Utils = require('../../utils/utils');
const {
  sUserSettings,
  xLoginOption,
  xLoginBtn,
  xLogoutOption,
  sEmailInput,
  sPasswordInput,
  xAppTitle
} = require('../../utils/selectorsAndXPaths');

const xWelcomeMessage = '//span[contains(., "Welcome")]';
const xGoodbyeMessage = '//span[contains(., "Goodbye")]';
const sMenuBtn = 'button[aria-label="Open drawer"]';
const xMyStoriesLink = '//div[contains(@class, "MuiButtonBase-root")]/div[contains(., "My stories")]';
const xPleaseLoginForAdditionalFeatures = '//div[contains(@class, "MuiButtonBase-root")]/div[contains(., "Log in to use additional features")]';
const xCollectionsTableTitle = '//h6[contains(., "Collections")]';

describe('Authentication', () => {
  let browser;
  let page;
  let credentials;
  let utils;
  let endpoint;

  beforeAll(async () => {
    const beforeAll = await Utils.beforeAll();
    browser = beforeAll.browser;
    page = beforeAll.page;
    credentials = beforeAll.customConfig.credentials;
    endpoint = beforeAll.customConfig.endpoint;

    utils = new Utils(browser, page);
  });

  afterAll(async () => {
    await page.close();
  });

  it('should not have access to the admin options', async () => {
    await page.goto(endpoint);
    await utils.waitForElement(xAppTitle);
    await utils.clickOnElement(sMenuBtn);
    await utils.waitForElement(xPleaseLoginForAdditionalFeatures);
    await utils.closeDrawer();
  });

  it('should log in successfully', async () => {
    await page.click(sUserSettings);

    await utils.clickOnElement(
      xLoginOption,
      { waitForElement: sEmailInput },
    );

    await page.type(sEmailInput, credentials.email);
    await page.type(sPasswordInput, credentials.password);

    await utils.clickOnElement(xLoginBtn);
    const welcomeMessage = await page.waitForXPath(xWelcomeMessage);
    expect(welcomeMessage).toBeTruthy();
    await utils.closeSnackbar();
  });

  it('should have access to the admin options', async () => {
    await page.click(sMenuBtn);
    await page.waitForXPath(xPleaseLoginForAdditionalFeatures, { hidden: true });
    await utils.closeDrawer();
  });

  it('should log out successfully', async () => {
    await page.click(sUserSettings);
    await utils.clickOnElement(xLogoutOption(credentials.email), {
      waitForElement: xGoodbyeMessage,
    });
    await utils.closeSnackbar();
  });

  it('should login from a component that needs authentication', async () => {
    await utils.clickOnElement(sMenuBtn);

    await utils.clickOnElement(xPleaseLoginForAdditionalFeatures, {
      waitForElement: sEmailInput,
    });

    await page.type(sEmailInput, credentials.email);
    await page.type(sPasswordInput, credentials.password);

    await utils.clickOnElement(xLoginBtn);
    await utils.closeSnackbar();
  });

  it('should be allowed to access my stories when logged in', async () => {
    await utils.clickOnElement(sMenuBtn);
    await utils.clickOnElement(xMyStoriesLink);
    await utils.waitForElement(xCollectionsTableTitle);
    expect(page.url().endsWith('/admin/stories')).toBe(true);
  });

  it('should redirect to landing if the user logs out from a page that needs authentication', async () => {
    await utils.clickOnElement(
      sUserSettings,
      { waitAfterVisible: 1000 }
    );
    await utils.clickOnElement(xLogoutOption(credentials.email));
    await utils.waitForElement(xAppTitle);
    expect(page.url().endsWith('/public')).toBe(true);
  });
});

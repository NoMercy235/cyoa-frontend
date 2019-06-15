const Utils = require('./utils');

const sAppTitle = 'h6[class*="appTitle"]';
const sUserSettings = 'div[class*="settingsBtn"]';
const xLoginOption = '//li[contains(., "Login")]';
const xLogoutOption = '//li[contains(., "Logout")]';
const sEmailInput = 'input[name="email"]';
const sPasswordInput = 'input[name="password"]';
const xLoginBtn = '//button[contains(., "Login")]';
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

  beforeAll(async () => {
    browser = global.__BROWSER__;
    page = await browser.newPage();
    credentials = global.__CUSTOM_CONFIG__.credentials;
    const endpoint = global.__CUSTOM_CONFIG__.endpoint;

    utils = new Utils(browser, page);

    await page.goto(endpoint);
    await page.setViewport({ width: 0, height: 0 });
  });

  afterAll(() => {
    browser.close();
  });

  it('should not have access to the admin options', async () => {
    await page.click(sMenuBtn);
    await page.waitForXPath(xPleaseLoginForAdditionalFeatures);
    await utils.closeDrawer();
  });

  it('should log in successfully', async () => {
    await page.click(sUserSettings);

    await utils.clickOnElement(xLoginOption, {
      waitForElement: sEmailInput,
    });

    await page.type(sEmailInput, credentials.username);
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
    await utils.clickOnElement(xLogoutOption, {
      waitForElement: xGoodbyeMessage,
    });
    await utils.closeSnackbar();
  });

  it('should login from a component that needs authentication', async () => {
    await utils.clickOnElement(sMenuBtn);

    await utils.clickOnElement(xPleaseLoginForAdditionalFeatures, {
      waitForElement: sEmailInput,
    });

    await page.type(sEmailInput, credentials.username);
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
    await utils.clickOnElement(sUserSettings);
    await utils.clickOnElement(xLogoutOption);
    await utils.waitForElement(sAppTitle);
    expect(page.url().endsWith('/public')).toBe(true);
  });
});

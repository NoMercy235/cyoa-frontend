const Utils = require('../../utils/utils');
const {
  sUserSettings,
  xLoginOption,
  xLoginBtn,
  xCloseModalBtn,
  sEmailInput,
  sPasswordInput
} = require('../../utils/selectorsAndXPaths');

const xWrongEmailFormatErrorMessage = '//p[contains(., "Email is invalid")]';
const xFieldRequiredErrorMessage = '//p[contains(., "This field is required")]';
const xWrongCredentialsErrorMessage = '//span[contains(., "Authentication failed. Username or password are incorrect")]';

describe('Authentication errors', () => {
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
    await page.goto(endpoint);
  });

  afterAll(async () => {
    await page.close();
  });

  it('should tell the user that the email is invalid and password is required', async () => {
    await page.click(sUserSettings);

    await utils.clickOnElement(
      xLoginOption,
      { waitForElement: sEmailInput },
    );

    await page.type(sEmailInput, 'invalid email');
    await page.type(sPasswordInput, '');

    await utils.clickOnElement(xLoginBtn);
    await page.waitForXPath(xWrongEmailFormatErrorMessage);
    await page.waitForXPath(xFieldRequiredErrorMessage);

    await utils.clickOnElement(
      xCloseModalBtn,
    );
  });

  it('should show error message if credentials are wrong', async () => {
    await utils.clickOnElement(
      sUserSettings,
      { waitAfterVisible: 1000 }
    );

    await utils.clickOnElement(
      xLoginOption,
      { waitForElement: sPasswordInput },
    );

    await utils.waitForElement(sPasswordInput);

    await page.type(sEmailInput, 'bogusEmail@nonexistent.com');
    await page.type(sPasswordInput, 'this is not even true');

    await utils.clickOnElement(xLoginBtn);
    const wrongCredentialsMessage = await page.waitForXPath(xWrongCredentialsErrorMessage);
    expect(wrongCredentialsMessage).toBeTruthy();
  });
});

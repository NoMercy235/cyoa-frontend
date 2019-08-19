const createContext = require('../../utils/utils');
const {
  sUserSettings,
  xLoginOption,
  xLoginBtn,
  xLogoutOption,
  sEmailInput,
  sPasswordInput,
  xAppTitle,
} = require('../../utils/selectorsAndXPaths');

const xWelcomeMessage = '//span[contains(., "Welcome")]';
const xGoodbyeMessage = '//span[contains(., "Goodbye")]';
const xMyStoriesLink = '//div[contains(@class, "MuiButtonBase-root")]/div[contains(., "My stories")]';
const xPleaseLoginForAdditionalFeatures = '//div[contains(@class, "MuiButtonBase-root")]/div[contains(., "Log in to use additional features")]';
const xCollectionsTableTitle = '//h6[contains(., "Collections")]';

describe('Authentication happy path and restrictions', () => {
  let context;

  beforeAll(async () => {
    context = await createContext({ navigateToEndpoint: true });
  });

  afterAll(async () => {
    await context.page.close();
  });

  it('should not have access to the admin options', async () => {
    const { waitForElement, openDrawer, closeDrawer } = context;
    await waitForElement(xAppTitle);
    await openDrawer();
    await waitForElement(xPleaseLoginForAdditionalFeatures);
    await closeDrawer();
  });

  it('should log in successfully', async () => {
    const { page, clickOnElement, closeSnackbar, customConfig: { credentials } } = context;
    await page.click(sUserSettings);

    await clickOnElement(
      xLoginOption,
      { waitForElement: sEmailInput },
    );

    await page.type(sEmailInput, credentials.email);
    await page.type(sPasswordInput, credentials.password);

    await clickOnElement(xLoginBtn);
    const welcomeMessage = await page.waitForXPath(xWelcomeMessage);
    expect(welcomeMessage).toBeTruthy();
    await closeSnackbar();
  });

  it('should have access to the admin options', async () => {
    const { page, openDrawer, closeDrawer } = context;
    await openDrawer();
    await page.waitForXPath(xPleaseLoginForAdditionalFeatures, { hidden: true });
    await closeDrawer();
  });

  it('should log out successfully', async () => {
    const { page, clickOnElement, closeSnackbar, customConfig: { credentials } } = context;
    await page.click(sUserSettings);
    await clickOnElement(xLogoutOption(credentials.email), {
      waitForElement: xGoodbyeMessage,
    });
    await closeSnackbar();
  });

  it('should login from a component that needs authentication', async () => {
    const {
      page,
      clickOnElement,
      closeSnackbar,
      openDrawer,
      customConfig: { credentials },
    } = context;
    await openDrawer();

    await clickOnElement(xPleaseLoginForAdditionalFeatures, {
      waitForElement: sEmailInput,
    });

    await page.type(sEmailInput, credentials.email);
    await page.type(sPasswordInput, credentials.password);

    await clickOnElement(xLoginBtn);
    await closeSnackbar();
  });

  it('should be allowed to access my stories when logged in', async () => {
    const { page, clickOnElement, waitForElement, openDrawer } = context;
    await openDrawer();
    await clickOnElement(xMyStoriesLink);
    await waitForElement(xCollectionsTableTitle);
    expect(page.url().endsWith('/admin/stories')).toBe(true);
  });

  it('should redirect to landing if the user logs out from a page that needs authentication', async () => {
    const { page, clickOnElement, waitForElement, customConfig: { credentials } } = context;
    await clickOnElement(
      sUserSettings,
      { waitAfterVisible: 1000 }
    );
    await clickOnElement(xLogoutOption(credentials.email));
    await waitForElement(xAppTitle);
    expect(page.url().endsWith('/public')).toBe(true);
  });
});

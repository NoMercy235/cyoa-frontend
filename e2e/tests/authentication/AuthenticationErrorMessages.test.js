const createContext = require('../../utils/utils');
const {
  sUserSettings,
  xLoginOption,
  xLoginBtn,
  sEmailInput,
  sPasswordInput
} = require('../../utils/selectorsAndXPaths');

const xWrongEmailFormatErrorMessage = '//p[contains(., "Email is invalid")]';
const xFieldRequiredErrorMessage = '//p[contains(., "This field is required")]';
const xWrongCredentialsErrorMessage = '//span[contains(., "Authentication failed. Username or password are incorrect")]';

describe('Authentication errors', () => {
  let context;

  beforeAll(async () => {
    context = await createContext({ navigateToEndpoint: true });
  });

  afterAll(async () => {
    await context.page.close();
  });

  it('should tell the user that the email is invalid and password is required', async () => {
    const { page, clickOnElement, waitForElement, closeModal } = context;

    await page.click(sUserSettings);

    await clickOnElement(
      xLoginOption,
      { waitForElement: sEmailInput },
    );

    await page.type(sEmailInput, 'invalid email');
    await page.type(sPasswordInput, '');

    await clickOnElement(xLoginBtn);
    await waitForElement(xWrongEmailFormatErrorMessage);
    await waitForElement(xFieldRequiredErrorMessage);

    await closeModal();
  });

  it('should show error message if credentials are wrong', async () => {
    const { page, clickOnElement, waitForElement} = context;

    await clickOnElement(
      sUserSettings,
    );

    await clickOnElement(
      xLoginOption,
      { waitForElement: sPasswordInput },
    );

    await waitForElement(sPasswordInput);

    await page.type(sEmailInput, 'bogusEmail@nonexistent.com');
    await page.type(sPasswordInput, 'this is not even true');

    await clickOnElement(xLoginBtn);
    const wrongCredentialsMessage = await page.waitForXPath(xWrongCredentialsErrorMessage);
    expect(wrongCredentialsMessage).toBeTruthy();
  });
});

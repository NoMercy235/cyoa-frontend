const createContext = require('./utils/utils');
const faker = require('faker');

const sNewStoryBtn = '//button//*[name()="svg" and @title="New story"]';
const xCreateStoryModalTitle = '//h6[contains(., "Create story")]';
const xTagsInput = '//div[contains(@class, "MuiSelect-root")]/input[@name="tags"]/..';
const sNameInput = 'input[name="name"]';
const sShortDescInput = 'textarea[name="shortDescription"]';
const sLongDescInput = 'textarea[name="longDescription"]';
const xAdventureListItem = '//li[contains(., "Adventure")]';
const xSaveStoryBtn = '//button[contains(., "Save")]';
const xStoryTableRow = storyName => `//tr[contains(@class, "MuiTableRow-root")]/td/span[text()="${storyName}"]`;
const xStoryTableDeleteAction = storyName => `//tr[contains(@class, "MuiTableRow-root")]/td/span[text()="${storyName}"]/../../td[last()]/div/button[last()]/span`;
const xYesBtn = '//button[contains(., "Yes")]';
const xStoryDeletedMessage = '//span[contains(., "Story deleted!")]';

const xStoryNameTableCell = storyName => `//td[contains(@class, "MuiTableCell-root")]/span[text()="${storyName}"]`;
const xStoryNameBreadcrumb = storyName => `//div[contains(@class, "MuiChip-root")]/span[text()="${storyName}"]`;
const xPublishBtn = '//button[contains(., "Publish")]';
const xNoBtn = '//button[contains(., "No")]';
const xNoStartSeqErrorText = '//li[text()="The story has no associated start sequence"]';
const xNoEndSeqErrorText = '//li[text()="The story has no associated ending. You need at least one ending sequence"]';

describe('AdminStory', () => {
  let context;
  let storyName;

  beforeAll(async () => {
    context = await createContext({
      navigateToEndpoint: true,
      withLogin: true,
    });
  });

  afterAll(async () => {
    const { page, logout, customConfig: { credentials } } = context;
    await logout(credentials);
    await page.close();
  });

  describe('Basic story', () => {
    it('should create a test story successfully', async () => {
      const {
        page,
        clickOnElement,
        closeSnackbar,
        waitForElement,
        customConfig: { endpoint },
      } = context;

      await page.goto(`${endpoint}admin/stories`);
      await clickOnElement(sNewStoryBtn, {
        waitForElement: xCreateStoryModalTitle,
      });

      storyName = faker.random.words(5);

      await clickOnElement(xTagsInput, {
        waitAfterVisible: 100,
      });
      await clickOnElement(xAdventureListItem);
      await clickOnElement(xCreateStoryModalTitle);
      await page.type(sNameInput, storyName);
      await page.type(sShortDescInput, faker.lorem.sentence());
      await page.type(sLongDescInput, faker.lorem.sentence());

      await clickOnElement(xSaveStoryBtn);
      await closeSnackbar();
      await waitForElement(xStoryTableRow(storyName));
    });

    it('should view the name of the new story in the general tab', async () => {
      const { clickOnElement, waitForElement } = context;
      await clickOnElement(xStoryNameTableCell(storyName));
      await waitForElement(xStoryNameBreadcrumb(storyName));
    });

    it('should not be able to publish the story with no start sequence and no end sequence', async () => {
      const { clickOnElement, waitForElement } = context;

      await clickOnElement(xPublishBtn);
      await clickOnElement(xYesBtn);
      await Promise.all([
        waitForElement(xNoStartSeqErrorText),
        waitForElement(xNoEndSeqErrorText),
      ]);
      await clickOnElement(xNoBtn);
    });

    it('should delete the created story', async () => {
      const {
        page,
        clickOnElement,
        waitForElement,
        customConfig: { endpoint },
      } = context;

      await page.goto(`${endpoint}admin/stories`);
      await clickOnElement(xStoryTableDeleteAction(storyName));
      await clickOnElement(xYesBtn);
      await waitForElement(xStoryDeletedMessage);
    });
  });

});

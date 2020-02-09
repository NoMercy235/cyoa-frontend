const createContext = require('../../utils/utils');
const { xNameNotUniqueError } = require('../../utils/selectorsAndXPaths');
const { createStory, deleteStory } = require('../steps/AdminStory.steps');

const xStoryTableRow = storyName => `//tr[contains(@class, "MuiTableRow-root")]/td/span[text()="${storyName}"]`;
const xStoryTableDeleteAction = storyName => `//tr[contains(@class, "MuiTableRow-root")]/td/span[text()="${storyName}"]/../../td[last()]/div/button[last()]/span`;
const xYesBtn = '//button[contains(., "Yes")]';
const xStoryDeletedMessage = '//span[contains(., "Story deleted!")]';
const xStorySavedMessage = '//span[contains(., "Story saved!")]';

const xStoryNameTableCell = storyName => `//td[contains(@class, "MuiTableCell-root")]/span[text()="${storyName}"]`;
const xStoryNameBreadcrumb = storyName => `//div[contains(@class, "MuiChip-root")]/span[text()="${storyName}"]`;
const xPublishBtn = '//button[contains(., "Publish")]';
const xNoBtn = '//button[contains(., "No")]';
const xNoStartSeqErrorText = '//li[text()="The story has no associated start sequence"]';
const xNoEndSeqErrorText = '//li[text()="The story has no associated ending. You need at least one ending sequence"]';

describe('Story workflow', () => {
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
        waitForElement,
      } = context;

      storyName = await createStory(context);
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

    it('should not allow the creation of a story with the same name', async () => {
      const { waitForElement, closeSnackbar, closeModal } = context;

      await createStory(context, { name: storyName }, { keepSnackbar: true });

      await waitForElement(xNameNotUniqueError);
      await closeSnackbar();
      await closeModal();
    });

    it('should delete the created story', async () => {
      const {
        waitForElement,
      } = context;

      await deleteStory(storyName, context, { keepSnackbar: true });
      await waitForElement(xStoryDeletedMessage);
    });
  });

});

const Utils = require('./utils/utils');
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
  let browser;
  let page;
  let credentials;
  let utils;
  let endpoint;

  let storyName;

  beforeAll(async () => {
    const beforeAll = await Utils.beforeAll();
    browser = beforeAll.browser;
    page = beforeAll.page;
    credentials = beforeAll.customConfig.credentials;
    endpoint = beforeAll.customConfig.endpoint;

    utils = new Utils(browser, page);

    await page.goto(endpoint);
    await utils.login(credentials);
  });

  afterAll(async () => {
    await utils.logout(credentials);
    await page.close();
  });

  describe('Basic story', () => {
    it('should create a test story successfully', async () => {
      await page.goto(`${endpoint}admin/stories`);
      await utils.clickOnElement(sNewStoryBtn, {
        waitForElement: xCreateStoryModalTitle,
      });

      storyName = faker.random.words(5);

      await utils.clickOnElement(xTagsInput, {
        waitAfterVisible: 100,
      });
      await utils.clickOnElement(xAdventureListItem);
      await utils.clickOnElement(xCreateStoryModalTitle);
      await page.type(sNameInput, storyName);
      await page.type(sShortDescInput, faker.lorem.sentence());
      await page.type(sLongDescInput, faker.lorem.sentence());

      await utils.clickOnElement(xSaveStoryBtn);
      await utils.closeSnackbar();
      await utils.waitForElement(xStoryTableRow(storyName));
    });

    it('should view the name of the new story in the general tab', async () => {
      await utils.clickOnElement(xStoryNameTableCell(storyName));
      await utils.waitForElement(xStoryNameBreadcrumb(storyName));
    });

    it('should not be able to publish the story with no start sequence and no end sequence', async () => {
      await utils.clickOnElement(xPublishBtn);
      await utils.clickOnElement(xYesBtn);
      await Promise.all([
        utils.waitForElement(xNoStartSeqErrorText),
        utils.waitForElement(xNoEndSeqErrorText),
      ]);
      await utils.clickOnElement(xNoBtn);
    });

    it('should delete the created story', async () => {
      await page.goto(`${endpoint}admin/stories`);
      await utils.clickOnElement(xStoryTableDeleteAction(storyName));
      await utils.clickOnElement(xYesBtn);
      await utils.waitForElement(xStoryDeletedMessage);
    });
  });

});

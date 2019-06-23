const Utils = require('./utils/utils');
const faker = require('faker');

const sNewStoryBtn = 'button[title="New story"]';
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
const xAdminBreadcrumb = '//div[contains(@class, "MuiChip-root")]/span[text()="Admin"]';

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

  it('should create a test story successfully', async () => {
    await page.goto(`${endpoint}admin/stories`);
    await utils.clickOnElement(sNewStoryBtn, {
      waitForElement: xCreateStoryModalTitle,
    });

    storyName = faker.random.words(5);

    await utils.clickOnElement(xTagsInput);
    await utils.clickOnElement(xAdventureListItem);
    await utils.clickOnElement(xCreateStoryModalTitle);
    await page.type(sNameInput, storyName);
    await page.type(sShortDescInput, faker.lorem.sentence());
    await page.type(sLongDescInput, faker.lorem.sentence());

    await utils.clickOnElement(xSaveStoryBtn);
    await utils.closeSnackbar();
    await utils.waitForElement(xStoryTableRow(storyName));
  });

  it('should view the name of the new story', async () => {
    await utils.clickOnElement(xStoryNameTableCell(storyName));
    await utils.waitForElement(xStoryNameBreadcrumb(storyName));
    await utils.clickOnElement(xAdminBreadcrumb);
  });

  it('should delete the created story', async () => {
    await utils.clickOnElement(xStoryTableDeleteAction(storyName));
    await utils.clickOnElement(xYesBtn);
    await utils.waitForElement(xStoryDeletedMessage);
  });

});

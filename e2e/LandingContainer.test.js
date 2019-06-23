const Utils = require('./utils/utils');
const DataMock = require('./utils/dataGenerator');

const xStoryBoxes = '//div[contains(@class, "storiesContainer")]/child::node()';
const sQuickSearchInput = 'input[placeholder="Search..."]';
const sProgressBar = '#nprogress';

const QUICK_FILTER = 'stanley';

describe('LandingContainer guest', () => {
  let browser;
  let page;
  let utils;
  let endpoint;

  beforeAll(async () => {
    const beforeAll = await Utils.beforeAll();
    browser = beforeAll.browser;
    page = beforeAll.page;
    endpoint = beforeAll.customConfig.endpoint;

    utils = new Utils(browser, page);

    await page.setRequestInterception(true);
    const dataMock = new DataMock(page);
    dataMock.mockStories();
    dataMock.mockStoriesQuickSearch(QUICK_FILTER);
  });

  afterAll(async () => {
    await page.close();
  });

  it('should see two stories', async () => {
    await page.goto(endpoint);
    await utils.waitForElement(xStoryBoxes);
    const storyBoxes = await page.$x(xStoryBoxes);

    expect(storyBoxes.length).toEqual(2);
  });

  it('should quick search with the string stanley and see only one story', async () => {
    await page.type(sQuickSearchInput, QUICK_FILTER);
    await utils.waitForElement(sProgressBar, { hidden: true });
    await utils.waitForElement(xStoryBoxes);
    const storyBoxes = await page.$x(xStoryBoxes);

    expect(storyBoxes.length).toEqual(1);
  });
});

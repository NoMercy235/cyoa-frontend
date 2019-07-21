const Utils = require('./utils/utils');
const DataMock = require('./utils/dataGenerator');

const xStoryBoxes = '//div[contains(@class, "storiesContainer")]/div/*[not(h6[text()="This is it. There\'s nothing more past this point."])]/child::node()';
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
    await page.goto(endpoint, { waitUntil: 'networkidle2' });
    await utils.waitForElement(sProgressBar, { hidden: true });
    await utils.waitForElement(xStoryBoxes);
    const storyBoxes = await page.$x(xStoryBoxes);

    // TODO: fix this with XPath someday
    // The extra child is the end of stories component
    expect(storyBoxes.length).toEqual(3);
  });

  it('should quick search with the string stanley and see only one story', async () => {
    await page.type(sQuickSearchInput, QUICK_FILTER);
    await utils.waitForElement(sProgressBar, { hidden: true });
    await utils.waitForElement(xStoryBoxes);
    const storyBoxes = await page.$x(xStoryBoxes);

    // The extra child is the end of stories component
    expect(storyBoxes.length).toEqual(2);
  });
});

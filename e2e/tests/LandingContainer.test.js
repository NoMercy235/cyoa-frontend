const createContext = require('../utils/utils');
const DataMock = require('../utils/dataGenerator');

const xStoryBoxes = '//div[contains(@class, "infinite-scroll-component")]/div[position() < last()]';
const xStoryReadTimes = '//li/div/span[starts-with(text(), "Read: ")]';
const sQuickSearchInput = 'input[placeholder="Search..."]';
const sProgressBar = '#nprogress';
const sGithubOption = 'img[alt="GitHub"]';

const QUICK_FILTER = 'stanley';

describe('LandingContainer guest', () => {
  let context;

  beforeAll(async () => {
    context = await createContext({
      navigateToEndpoint: true,
      interceptRequest: (context) => {
        const dataMock = new DataMock(context.page);
        dataMock.mockStories();
        dataMock.mockStoriesQuickSearch(QUICK_FILTER);
      },
    });
  });

  afterAll(async () => {
    await context.page.close();
  });

  it('should see two stories', async () => {
    const { page, waitForElement, customConfig: { endpoint } } = context;

    await page.goto(endpoint, { waitUntil: 'networkidle2' });
    await waitForElement(sProgressBar, { hidden: true });
    await waitForElement(xStoryBoxes);
    const storyBoxes = await page.$x(xStoryBoxes);
    expect(storyBoxes.length).toEqual(2);
  });

  it('should see the read times for both stories', async () => {
    const { waitForElement } = context;
    await waitForElement(xStoryReadTimes);
  });

  it('should quick search with the string stanley and see only one story', async () => {
    const { page, waitForElement } = context;

    await page.type(sQuickSearchInput, QUICK_FILTER);
    await waitForElement(sProgressBar, { hidden: true });
    await waitForElement(xStoryBoxes);
    const storyBoxes = await page.$x(xStoryBoxes);

    expect(storyBoxes.length).toEqual(1);
  });

  it('should see the GitHub menu option', async () => {
    const { waitForElement, openDrawer } = context;

    await openDrawer();
    await waitForElement(sGithubOption);
  });
});

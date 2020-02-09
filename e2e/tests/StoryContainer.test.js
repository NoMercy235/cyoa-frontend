const createContext = require('../utils/utils');
const {
  createCollection,
  deleteCollection,
  createStory,
  deleteStory,
} = require('./steps/AdminStory.steps');
const {
  xSelectInput,
  xSelectListItem,
  xModalContainer,
  xModalSaveBtn,
} = require('../utils/selectorsAndXPaths');

const xSelectedCollection = (collectionName) => `//span[.="${collectionName}"]/*[name()='svg']`;
const xStoryTableEditAction = storyName => `//tr[contains(@class, "MuiTableRow-root")]/td/span[text()="${storyName}"]/../../td[last()]/div/button[position() = (last() - 1)]/span`;

describe('StoryContainer', () => {
  let context;
  let storyName;
  let collectionName;

  beforeAll(async () => {
    context = await createContext({
      withLogin: true,
    });
    collectionName = await createCollection(context);
    await context.page.goto(`${context.customConfig.endpoint}admin/stories`);
  });

  afterAll(async () => {
    const { page, logout, customConfig: { credentials } } = context;
    await deleteCollection(collectionName, context);
    await logout(credentials);
    await page.close();
  });

  it('should create a story in the current collection and see the current collection', async () => {
    const { waitForElement } = context;

    storyName = await createStory(context);
    await waitForElement(xSelectedCollection("Default"));
    await deleteStory(storyName, context);
  });

  it('should create a story in the another collection and set it as the current one', async () => {
    const {  waitForElement } = context;

    storyName = await createStory(context, { fromCollection: collectionName });
    await waitForElement(xSelectedCollection(collectionName));
    await deleteStory(storyName, context);
  });

  it('should create a story in the default collection, move it to another one and check selectedCollection', async () => {
    const {
      clickOnElement,
      waitForElement
    } = context;

    storyName = await createStory(context);
    await clickOnElement(xStoryTableEditAction(storyName));

    await clickOnElement(xSelectInput('fromCollection'), {
      waitAfterVisible: 100,
    });
    await clickOnElement(xSelectListItem(collectionName));
    await clickOnElement(xModalContainer, {
      waitAfterVisible: 500,
    });
    await clickOnElement(xModalSaveBtn);
    await waitForElement(xSelectedCollection(collectionName));
    await deleteStory(storyName, context);
  });
});

const faker = require('faker');
const {
  xSelectInput,
  xSelectListItem,
  xModalContainer,
  xModalSaveBtn,
} = require('../../utils/selectorsAndXPaths');

const sNameInput = 'input[name="name"]';

const xNewCollectionBtn = '//button//*[name()="svg" and @title="New collection"]';
const sDescriptionInput = 'textarea[name="description"]';


const xNewStoryBtn = '//button//*[name()="svg" and @title="New story"]';
const sShortDescInput = 'textarea[name="shortDescription"]';
const sLongDescInput = 'textarea[name="longDescription"]';
const xStoryTableDeleteAction = storyName => `//tr[contains(@class, "MuiTableRow-root")]/td/span[text()="${storyName}"]/../../td[last()]/div/button[last()]/span`;
const xYesBtn = '//button[contains(., "Yes")]';

const checkIfLocationIsGood = async ({ page, customConfig: { endpoint } }) => {
  const url = `${endpoint}admin/stories`;
  if (page.url().endsWith(url)) {
    return
  }
  await page.goto(`${endpoint}admin/stories`);
};

async function createCollection (context, { name } = {}) {
  const {
    page,
    clickOnElement,
    closeSnackbar,
  } = context;

  await checkIfLocationIsGood(context);
  await clickOnElement(xNewCollectionBtn, {
    waitForElement: xModalContainer,
  });

  const collectionName = name || faker.random.word();
  await page.type(sNameInput, collectionName);
  await page.type(sDescriptionInput, collectionName);

  await clickOnElement(xModalSaveBtn);
  await closeSnackbar();

  return collectionName;
}

async function deleteCollection (
  collectionName,
  context
) {
  const { clickOnElement, closeSnackbar } = context;
  await checkIfLocationIsGood(context);
  await clickOnElement(xStoryTableDeleteAction(collectionName));
  await clickOnElement(xYesBtn);
  await closeSnackbar();
}

async function createStory (
  context,
  { name, fromCollection } = {},
  { keepSnackbar } = {},
) {
  const {
    page,
    clickOnElement,
    closeSnackbar,
  } = context;

  await checkIfLocationIsGood(context);
  await clickOnElement(xNewStoryBtn, {
    waitForElement: xModalContainer,
  });

  const storyName = name || faker.random.words(5);

  await clickOnElement(xSelectInput('tags'), {
    waitAfterVisible: 100,
  });
  await clickOnElement(xSelectListItem('Adventure'));
  await clickOnElement(xModalContainer);

  await page.type(sNameInput, storyName);

  if (fromCollection) {
    await clickOnElement(xSelectInput('fromCollection'), {
      waitAfterVisible: 100,
    });
    await clickOnElement(xSelectListItem(fromCollection));
    await clickOnElement(xModalContainer);
  }

  await page.type(sShortDescInput, faker.lorem.sentence());
  await page.type(sLongDescInput, faker.lorem.sentence());

  await clickOnElement(xModalSaveBtn);
  if (!keepSnackbar) {
    await closeSnackbar();
  }

  return storyName;
}

async function deleteStory (
  storyName,
  context,
  { keepSnackbar } = {}
) {
  const { clickOnElement, closeSnackbar } = context;
  await checkIfLocationIsGood(context);
  await clickOnElement(xStoryTableDeleteAction(storyName), {
    waitAfterVisible: 500,
  });
  await clickOnElement(xYesBtn);
  if (!keepSnackbar) {
    await closeSnackbar();
  }
}

module.exports = {
  createCollection,
  deleteCollection,
  createStory,
  deleteStory,
};

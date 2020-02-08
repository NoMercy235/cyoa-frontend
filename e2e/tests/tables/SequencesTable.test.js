const createContext = require('../../utils/utils');
const DataMock = require('../../utils/dataGenerator');

const xSequencesTab = '//button[.="Sequences"]';
const sSequencesTableHeader = 'div[id="sequencesAdminTable"]';
const xPaginationNumbers = '//span[text()="1-10 of 11"]';
const sNextPageBtn = 'button[aria-label="Next Page"]';
const xTableLoading = '//div/*[name()=\'svg\']/*[name()=\'circle\']';

describe('Sequences admin table', () => {
  let context;

  beforeAll(async () => {
    context = await createContext({
      navigateToEndpoint: true,
      withLogin: true,
      interceptRequest: (context) => {
        const dataMock = new DataMock(context.page);
        dataMock.mockAdminStory(story);
        dataMock.mockAdminAttributes([]);
        dataMock.mockAdminSequences(sequences);
        dataMock.mockAdminChapters([]);
      },
    });
  });

  afterAll(async () => {
    await context.page.close();
  });

  it('should see the table', async () => {
    const {
      page,
      clickOnElement,
      waitForElement,
      customConfig: { endpoint },
    } = context;

    await page.goto(`${endpoint}admin/stories/${story._id}`);
    await clickOnElement(xSequencesTab);
    await waitForElement(sSequencesTableHeader);
  });

  // Removing the table loading state tests for now, until I figure out
  // how to deal with the mock response handlers which cannot be async.

  // it('should see the table loading when first loading the sequences', async () => {
  //   const { waitForElement } = context;
  //   await waitForElement(xTableLoading);
  //   await waitForElement(xTableLoading, { hidden: true });
  // });

  it('should see the correct pagination numbers', async () => {
    const { waitForElement } = context;
    await waitForElement(xPaginationNumbers);
  });

  // it('should see the table loading when changing the page', async () => {
  //   const { clickOnElement, waitForElement } = context;
  //   await clickOnElement(sNextPageBtn);
  //   await waitForElement(sTableLoading);
  // });
});

const story = {
  "_id": "5d5da678594a1f18471e6f08",
  "updated_at": "2019-08-21T20:16:10.316Z",
  "created_at": "2019-08-21T20:15:52.474Z",
  "authorShort": "sdasd dasdas",
  "author": {
    "_id": "5cc6cef8bc797b33bc17bee9",
    "email": "admin@askaround.com",
    "lastName": "dasdas",
    "firstName": "sdasd"
  },
  "name": "A new story",
  "shortDescription": "qwe",
  "longDescription": "qwe",
  "startSeq": "5d5da689594a1f18471e6f09",
  "__v": 0,
  "fromCollection": "",
  "tagsName": [
    "Fantasy",
    "Horror"
  ],
  "tags": [
    "5cb253f90e575743f18a91cb",
    "5cb253f90e575743f18a91cc"
  ],
  "chapters": [],
  "isAvailableOffline": false,
  "coverPic": null
};

const sequences = {
  "data": [
    {
      "_id": "5d5da689594a1f18471e6f09",
      "updated_at": "2019-08-21T20:16:34.806Z",
      "created_at": "2019-08-21T20:16:09.840Z",
      "hasScenePic": false,
      "story": "5d5da678594a1f18471e6f08",
      "name": "First sequence",
      "content": "sdasdas",
      "__v": 1,
      "options": [
        {
          "_id": "5d5da6a2594a1f18471e6f0b",
          "updated_at": "2019-08-21T20:16:34.693Z",
          "created_at": "2019-08-21T20:16:34.693Z",
          "story": "5d5da678594a1f18471e6f08",
          "action": "to the end",
          "sequence": "5d5da689594a1f18471e6f09",
          "nextSeq": "5d5da692594a1f18471e6f0a",
          "__v": 0,
          "consequences": []
        }
      ],
      "chapter": "",
      "order": 145,
      "isEnding": false
    },
    {
      "_id": "5d5da692594a1f18471e6f0a",
      "updated_at": "2019-08-21T20:16:18.367Z",
      "created_at": "2019-08-21T20:16:18.367Z",
      "hasScenePic": false,
      "story": "5d5da678594a1f18471e6f08",
      "name": "Last seq",
      "content": "dasdas",
      "__v": 0,
      "options": [],
      "chapter": "",
      "order": 146,
      "isEnding": true
    },
    {
      "_id": "5d5da7ed594a1f18471e6f0c",
      "updated_at": "2019-08-21T20:22:05.673Z",
      "created_at": "2019-08-21T20:22:05.673Z",
      "hasScenePic": false,
      "story": "5d5da678594a1f18471e6f08",
      "name": "Third story",
      "content": "qwe",
      "__v": 0,
      "options": [],
      "chapter": "",
      "order": 147,
      "isEnding": false
    },
    {
      "_id": "5d5da7f4594a1f18471e6f0d",
      "updated_at": "2019-08-21T20:22:12.185Z",
      "created_at": "2019-08-21T20:22:12.185Z",
      "hasScenePic": false,
      "story": "5d5da678594a1f18471e6f08",
      "name": "4th",
      "content": "ewq",
      "__v": 0,
      "options": [],
      "chapter": "",
      "order": 148,
      "isEnding": false
    },
    {
      "_id": "5d5da7f9594a1f18471e6f0e",
      "updated_at": "2019-08-21T20:22:17.226Z",
      "created_at": "2019-08-21T20:22:17.226Z",
      "hasScenePic": false,
      "story": "5d5da678594a1f18471e6f08",
      "name": "5th",
      "content": "fsdgew",
      "__v": 0,
      "options": [],
      "chapter": "",
      "order": 149,
      "isEnding": false
    },
    {
      "_id": "5d5da7ff594a1f18471e6f0f",
      "updated_at": "2019-08-21T20:22:23.205Z",
      "created_at": "2019-08-21T20:22:23.205Z",
      "hasScenePic": false,
      "story": "5d5da678594a1f18471e6f08",
      "name": "6th",
      "content": "ghdfwe",
      "__v": 0,
      "options": [],
      "chapter": "",
      "order": 150,
      "isEnding": false
    },
    {
      "_id": "5d5da804594a1f18471e6f10",
      "updated_at": "2019-08-21T20:22:28.705Z",
      "created_at": "2019-08-21T20:22:28.705Z",
      "hasScenePic": false,
      "story": "5d5da678594a1f18471e6f08",
      "name": "7th",
      "content": "fdsfsd",
      "__v": 0,
      "options": [],
      "chapter": "",
      "order": 151,
      "isEnding": false
    },
    {
      "_id": "5d5da811594a1f18471e6f11",
      "updated_at": "2019-08-21T20:22:41.439Z",
      "created_at": "2019-08-21T20:22:41.439Z",
      "hasScenePic": false,
      "story": "5d5da678594a1f18471e6f08",
      "name": "8th",
      "content": "dsfsd",
      "__v": 0,
      "options": [],
      "chapter": "",
      "order": 152,
      "isEnding": false
    },
    {
      "_id": "5d5da81c594a1f18471e6f12",
      "updated_at": "2019-08-21T20:22:52.997Z",
      "created_at": "2019-08-21T20:22:52.997Z",
      "hasScenePic": false,
      "story": "5d5da678594a1f18471e6f08",
      "name": "9th",
      "content": "fsdfsd",
      "__v": 0,
      "options": [],
      "chapter": "",
      "order": 153,
      "isEnding": false
    },
    {
      "_id": "5d5da823594a1f18471e6f13",
      "updated_at": "2019-08-21T20:22:59.566Z",
      "created_at": "2019-08-21T20:22:59.566Z",
      "hasScenePic": false,
      "story": "5d5da678594a1f18471e6f08",
      "name": "10th",
      "content": "gwerwe",
      "__v": 0,
      "options": [],
      "chapter": "",
      "order": 154,
      "isEnding": false
    },
    {
      "_id": "5d5da823594a1f18471e6f14",
      "updated_at": "2019-08-21T20:22:59.566Z",
      "created_at": "2019-08-21T20:22:59.566Z",
      "hasScenePic": false,
      "story": "5d5da678594a1f18471e6f08",
      "name": "11th",
      "content": "rttttttt",
      "__v": 0,
      "options": [],
      "chapter": "",
      "order": 156,
      "isEnding": false
    },
  ],
  "page": 0,
  "total": 11
};

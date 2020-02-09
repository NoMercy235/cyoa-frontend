module.exports = {
  browser: {
    // https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerlaunchoptions
  },
  puppeteer: {
    // https://github.com/GoogleChrome/puppeteer/blob/master/docs/api.md#puppeteerconnectoptions
  },
  endpoint: 'http://whereveritshosted/',
  credentials: {
    _id: 'mongodb id for the user that was created',
    email: 'valid email',
    password: 'valid password',
    firstName: 'automated',
    lastName: 'tests',
    shortName: 'automated tests',
  },
};

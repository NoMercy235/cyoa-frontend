const {
  landingStories,
  landingPagination,
} = require('../mocks/stories');

function createRegexp (stringToGoIntoTheRegex) {
  const parsed = stringToGoIntoTheRegex.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  // We need to match anything other query params that go after it
  return new RegExp(`${parsed}[\\S]+`);
}

class DataMock {
  constructor (page) {
    this.page = page;
    this.handlers = [];
    this.page.on('request', req => {
      const hadHandler = this.handlers.find(handler => {
        return handler(req);
      });
      !hadHandler && req.continue();
    });
  }

  _handleRequest (match, response, config = {}) {
    this.handlers.push(req => {
      if (match(req)) {
        let body;

        if (config.pagination) {
          body = {
            data: response,
            ...config.pagination
          }
        } else {
          body = response;
        }

        req.respond({
          status: 200 || config.status,
          contentType: 'application/json' || config.contentType,
          body: JSON.stringify(body),
        });
        return true;
      }
      return false;
    });
  }

  mockStories (stories = landingStories, config = { pagination: landingPagination }) {
    const regexp = createRegexp(`public/story?`);

    this._handleRequest(
      req => {
        return !!(req.url().match(regexp));
      },
      stories,
      config,
    );
  }

  mockStoriesQuickSearch (filter, stories = landingStories, config = { pagination: landingPagination }) {
    const regexp = createRegexp(`public/story/quick?quickSearch=${filter}`);

    const filteredStories = stories.filter(s => {
      return !!([s.name, s.shortDescription, s.longDescription].find(val => {
        return val.toLowerCase().includes(filter.toLowerCase());
      }));
    });

    this._handleRequest(
      req => {
        return !!(req.url().match(regexp));
      },
      filteredStories,
      config
    );
  }
}

module.exports = DataMock;

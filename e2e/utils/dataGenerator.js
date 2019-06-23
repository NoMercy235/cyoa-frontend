const landingStories = require('../mocks/stories').landingStories;

function createRegexp (stringToGoIntoTheRegex) {
  const parsed = stringToGoIntoTheRegex.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
  return new RegExp(parsed);
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
        req.respond({
          status: 200 || config.status,
          contentType: 'application/json' || config.contentType,
          body: JSON.stringify(response),
        });
        return true;
      }
      return false;
    });
  }

  mockStories (stories = landingStories) {
    this._handleRequest(
      req => req.url().endsWith('public/story?'),
      stories,
    );
  }

  mockStoriesQuickSearch (filter, stories = landingStories) {
    const regexp = createRegexp(`public/story/quick?quickSearch=${filter}`);

    this._handleRequest(
      req => {
        return !!(req.url().match(regexp));
      },
      stories.filter(s => {
        return !!([s.name, s.shortDescription, s.longDescription].find(val => {
          return val.toLowerCase().includes(filter.toLowerCase());
        }));
      }),
    );
  }
}

module.exports = DataMock;

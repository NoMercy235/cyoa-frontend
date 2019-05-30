import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import { BrowserRouter } from 'react-router-dom';

import { appStore } from './shared/store/AppStore';
import IndexRoute from './shared/components/layout/IndexRoute';
import { storyStore } from './admin/stories/stores/StoryStore';
import { storyViewStore } from './admin/story-view/stores/StoryViewStore';
import { publicStoryStore } from './public/landing/stores/PublicStoryStore';

import './App.scss';

class App extends Component {
  render() {
    return (
      <>
        <BrowserRouter>
          <Provider
            appStore={appStore}
            storyStore={storyStore}
            storyViewStore={storyViewStore}
            publicStoryStore={publicStoryStore}
          >
            <IndexRoute />
          </Provider>
        </BrowserRouter>
      </>
    );
  }
}

export default App;

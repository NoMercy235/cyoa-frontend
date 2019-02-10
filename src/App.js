import React, { Component, Fragment } from 'react';
import './App.scss';
import { Provider } from 'mobx-react';
import { appStore } from './shared/store/AppStore';
import IndexRoute from './shared/components/layout/IndexRoute';
import { BrowserRouter } from 'react-router-dom';
import { storyStore } from './admin/stories/stores/StoryStore';
import { storyViewStore } from './admin/story-view/stores/StoryViewStore';
import { publicStoryStore } from './public/landing/stores/PublicStoryStore';

class App extends Component {
  render() {
    return (
      <Fragment>
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
      </Fragment>
    );
  }
}

export default App;

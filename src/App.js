import React, { Component, Fragment } from 'react';
import './App.scss';
import { Provider } from 'mobx-react';
import { appStore } from './shared/store/AppStore';
import { testStore } from './landing/domain/TestStore';
import IndexRoute from './shared/components/layout/IndexRoute';
import { BrowserRouter } from 'react-router-dom';
import { storyStore } from './admin/stories/domain/stores/StoryStore';

class App extends Component {
  render() {
    return (
      <Fragment>
        <BrowserRouter>
          <Provider
            testStore={testStore}
            appStore={appStore}
            storyStore={storyStore}
          >
            <IndexRoute />
          </Provider>
        </BrowserRouter>
      </Fragment>
    );
  }
}

export default App;

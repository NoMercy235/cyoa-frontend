import React, { Component } from 'react';
import { Provider } from 'mobx-react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';

import { appStore } from './shared/store/AppStore';
import IndexRoute from './shared/components/layout/IndexRoute';
import { storyStore } from './admin/stories/stores/StoryStore';
import { storyViewStore } from './admin/story-view/stores/StoryViewStore';
import { publicStoryStore } from './public/landing/stores/PublicStoryStore';
import { getMainMuiTheme } from './shared/utilities';
import { socket } from './infrastructure/sockets/setup'
import { SocketEvents } from './shared/constants/events';

import './App.scss';

socket.on(SocketEvents.UsersOnline, data => {
  appStore.setOnlineUsers(data.onlineUsers);
});

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
            <ThemeProvider theme={getMainMuiTheme()}>
              <IndexRoute />
            </ThemeProvider>
          </Provider>
        </BrowserRouter>
      </>
    );
  }
}

export default App;

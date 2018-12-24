import React, { Component, Fragment } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import LandingRoute from './landing/view/LandingRoute';
import './App.scss';
import { Provider } from 'mobx-react';
import { testStore } from './landing/domain/TestStore';

class App extends Component {
  render() {
    return (
      <Fragment>
        <Provider testStore={testStore}>
          <BrowserRouter>
            <Switch>
              <Route exact path='/' component={LandingRoute} />
              <Redirect to='/' />
            </Switch>
          </BrowserRouter>
        </Provider>
      </Fragment>
    );
  }
}

export default App;

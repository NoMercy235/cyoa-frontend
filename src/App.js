import React, { Component, Fragment } from 'react';
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom';
import LandingRoute from './landing/view/LandingRoute';
import './App.css';

class App extends Component {
  render() {

    return (
      <Fragment>
        <BrowserRouter>
          <Switch>
            <Route exact path='/' component={LandingRoute} />
            <Redirect to='/' />
          </Switch>
        </BrowserRouter>
      </Fragment>
    );
  }
}

export default App;

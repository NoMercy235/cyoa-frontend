import React, { Component, Fragment } from 'react';
import './App.css';
import { BrowserRouter } from 'react-router-dom';
import Routes from './routes';

class App extends Component {
  render() {

    return (
      <Fragment>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </Fragment>
    );
  }
}

export default App;

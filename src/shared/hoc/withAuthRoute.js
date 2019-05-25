import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

export default function withAuthRoute(WrappedCmp) {
  @inject('appStore')
  @observer
  class AuthenticatedComponent extends Component {
    UNSAFE_componentWillMount() {
      this.checkAuth();
    }

    checkAuth() {
      if (!this.props.appStore.isLoggedIn) {
        this.props.history.replace('/');
      }
    }

    render() {
      return this.props.appStore.isLoggedIn
        ? <WrappedCmp { ...this.props } />
        : null;
    }
  }

  return withRouter(AuthenticatedComponent);
}

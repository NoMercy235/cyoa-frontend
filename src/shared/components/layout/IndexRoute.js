import React, { Component } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import LandingRoute from '../../../landing/view/LandingRoute';
import { withDefaultLayout } from '../../hoc/DefaultLayout';
import AdminRoute from '../../../admin/AdminRoute';
import { inject, observer } from 'mobx-react';
import { appStorePropTypes } from '../../store/AppStore';
import withAuth from '../../hoc/AuthRoute';

@inject('appStore')
@observer
class IndexRoute extends Component {
  render() {
    return (
      <Switch>
        <Route exact path='/' component={LandingRoute} />
        <Route path='/admin' component={withAuth(AdminRoute)} />
        <Redirect to='/' />
      </Switch>
    );
  }
}

IndexRoute.propTypes = {
  appStore: appStorePropTypes,
};

export default withRouter(withDefaultLayout(IndexRoute));

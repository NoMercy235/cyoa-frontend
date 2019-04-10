import React, { Component } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { withDefaultLayout } from '../../hoc/DefaultLayout';
import AdminRoute from '../../../admin/AdminRoute';
import { inject, observer } from 'mobx-react';
import { appStorePropTypes } from '../../store/AppStore';
import withAuth from '../../hoc/AuthRoute';
import { tagService } from '../../../infrastructure/services/TagService';
import PublicRoute from '../../../public/PublicRoute';
import { ADMIN_ROUTE, LANDING_ROUTE } from '../../constants/routes';

@inject('appStore')
@observer
class IndexRoute extends Component {
  state = {
    canRender: false,
  };

  async getTags() {
    const tags = await tagService.list();
    localStorage.setItem('tags', JSON.stringify(tags));
  }

  async componentDidMount () {
    await this.getTags();
    this.setState({ canRender: true });
  }

  render() {
    if (!this.state.canRender) return null;

    return (
      <Switch>
        <Route path={LANDING_ROUTE} component={PublicRoute} />
        <Route path={ADMIN_ROUTE} component={withAuth(AdminRoute)} />
        <Redirect exact path='/' to={LANDING_ROUTE} />
      </Switch>
    );
  }
}

IndexRoute.propTypes = {
  appStore: appStorePropTypes,
};

export default withRouter(withDefaultLayout(IndexRoute));

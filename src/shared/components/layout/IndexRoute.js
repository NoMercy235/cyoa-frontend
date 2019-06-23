import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Detector } from 'react-detect-offline';

import { withDefaultLayout } from '../../hoc/DefaultLayout';
import { appStorePropTypes } from '../../store/AppStore';
import withAuth from '../../hoc/withAuthRoute';
import { tagService } from '../../../infrastructure/services/TagService';
import PublicRoute from '../../../public/PublicRoute';
import { ADMIN_ROUTE, LANDING_ROUTE, NOT_FOUND_ROUTE } from '../../constants/routes';
import { userService } from '../../../infrastructure/services/UserService';
import { authService } from '../../../infrastructure/services/AuthenticationService';
import Snackbar, { SnackbarEnum } from '../snackbar/Snackbar';
import NotFoundCmp from '../not-found/NotFoundCmp';
import { ONLINE_STATUS_POLLING_INTERVAL } from '../../constants/global';
import { configureIdb } from '../../idb';
import AuthenticationModal from '../authentication/AuthenticationModal';
import { TagModel } from '../../../infrastructure/models/TagModel';

const LazyAdminRoute = React.lazy(() => import('../../../admin/AdminRoute'));

@inject('appStore')
@observer
class IndexRoute extends Component {
  state = {
    canRender: false,
  };
  snackbarRef = React.createRef();

  getTags = async () => {
    const tags = await tagService.list();
    TagModel.set(tags);
  };

  getUser = async () => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      this.props.appStore.generateLocalId();
      return;
    }

    try {
      await authService.checkToken();
      const user = await userService.getUserWithToken();
      this.props.appStore.setUser(user);
    } catch (e) {
      this.props.appStore.generateLocalId();

      // Sometimes this can fail
      // TODO: investigate why
      if (!this.snackbarRef || !this.snackbarRef.current) return;

      this.snackbarRef.current.showSnackbar({
        variant: SnackbarEnum.Variants.Error,
        message: 'Token has expired. Please relog.',
      });
    }
  };

  updateOnlineStatus = (status) => {
    const { appStore } = this.props;
    appStore.setOnlineStatus(status);

    const displayedStatus = status ? 'Online' : 'Offline';

    this.snackbarRef.current.showSnackbar({
      variant: SnackbarEnum.Variants.Info,
      message: `You are now: ${displayedStatus}`,
      vertical: SnackbarEnum.Verticals.Bottom,
    });
  };

  setIdbStatus = async () => {
    if (!window.indexedDB) {
      this.props.appStore.setCanUseIdb(false);
    } else {
      this.props.appStore.setCanUseIdb(true);
      await configureIdb();
    }
  };

  async componentDidMount () {
    await this.setIdbStatus();
    await Promise.all([
      this.getTags(),
      this.getUser(),
    ]);
    this.setState({ canRender: true });
  }

  renderOnlineStatusDetector = () => {
    return (
      <Detector
        onChange={this.updateOnlineStatus}
        polling={{ interval: ONLINE_STATUS_POLLING_INTERVAL }}
        render={() => ''}
      />
    );
  };

  renderFallback = () => {
    return <div>Loading...</div>;
  };

  render() {
    const { canRender } = this.state;

    if (!canRender) return null;

    return (
      <>
        {this.renderOnlineStatusDetector()}
        <Suspense fallback={this.renderFallback()}>
          <Switch>
            <Route path={LANDING_ROUTE} component={PublicRoute} />
            <Route path={ADMIN_ROUTE} component={withAuth(LazyAdminRoute)} />
            <Route path={NOT_FOUND_ROUTE} component={NotFoundCmp} />
            <Redirect exact path='/' to={LANDING_ROUTE} />
          </Switch>
        </Suspense>

        <AuthenticationModal/>
        <Snackbar innerRef={this.snackbarRef}/>
      </>
    );
  }
}

IndexRoute.propTypes = {
  appStore: appStorePropTypes,
};

export default withRouter(withDefaultLayout(IndexRoute));

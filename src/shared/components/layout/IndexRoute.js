import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { Detector } from 'react-detect-offline';

import { withDefaultLayout } from '../../hoc/DefaultLayout';
import { appStorePropTypes } from '../../store/AppStore';
import withAuth from '../../hoc/withAuthRoute';
import { tagService } from '../../../infrastructure/services/TagService';
import PublicRoute from '../../../public/PublicRoute';
import {
  ADMIN_ROUTE,
  EMAIL_VERIFY_ROUTE,
  LANDING_ROUTE,
  NOT_FOUND_ROUTE,
  RECOVER_PASSWORD_ROUTE
} from '../../constants/routes';
import { userService } from '../../../infrastructure/services/UserService';
import { authService } from '../../../infrastructure/services/AuthenticationService';
import Snackbar, { SnackbarEnum } from '../snackbar/Snackbar';
import NotFoundCmp from '../not-found/NotFoundCmp';
import { ONLINE_STATUS_POLLING_INTERVAL } from '../../constants/global';
import { configureIdb } from '../../idb';
import AuthenticationModal from '../authentication/AuthenticationModal';
import { TagModel } from '../../../infrastructure/models/TagModel';
import EmailVerifyCmp from '../email-verify/EmailVerifyCmp';
import RecoverPasswordContainer from '../recover-password/RecoverPasswordContainer';
import { socket } from '../../../infrastructure/sockets/setup';
import { SocketEvents } from '../../constants/events';

const LazyAdminRoute = React.lazy(() => import('../../../admin/AdminRoute'));

@inject('appStore')
@observer
class IndexRoute extends Component {
  state = {
    canRender: false,
  };
  snackbarRef = React.createRef();
  detectorRef = React.createRef();

  getTags = async () => {
    const tags = await tagService.list();
    TagModel.set(tags);
  };

  getUser = async () => {
    const { appStore } = this.props;

    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      appStore.generateLocalId();
      return;
    }

    try {
      await authService.checkToken();
      const user = await userService.getUserWithToken();
      appStore.setUser(user);
      socket.emit(SocketEvents.UserOnline, user._id);
    } catch (e) {
      this.props.appStore.generateLocalId();

      // Sometimes this can fail
      // TODO: investigate why
      if (!this.snackbarRef || !this.snackbarRef.current) return;

      appStore.showSnackbar({
        variant: SnackbarEnum.Variants.Error,
        message: 'Token has expired. Please relog.',
      });
    }
  };

  updateOnlineStatus = (status) => {
    const { appStore } = this.props;
    appStore.setOnlineStatus(status);

    const displayedStatus = status ? 'Online' : 'Offline';

    appStore.showSnackbar({
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
    const { appStore } = this.props;

    await this.setIdbStatus();
    await Promise.all([
      this.getTags(),
      this.getUser(),
    ]);
    this.setState({ canRender: true });
    appStore.setOnlineStatus(this.detectorRef.current.state.online);
    appStore.setSnackbarRef(this.snackbarRef);
  }

  renderOnlineStatusDetector = () => {
    return (
      <Detector
        ref={this.detectorRef}
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
            <Route path={EMAIL_VERIFY_ROUTE} component={EmailVerifyCmp} />
            <Route path={RECOVER_PASSWORD_ROUTE} component={RecoverPasswordContainer} />
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

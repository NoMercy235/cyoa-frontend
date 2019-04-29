import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { withDefaultLayout } from '../../hoc/DefaultLayout';
import { inject, observer } from 'mobx-react';
import { appStorePropTypes } from '../../store/AppStore';
import withAuth from '../../hoc/AuthRoute';
import { tagService } from '../../../infrastructure/services/TagService';
import PublicRoute from '../../../public/PublicRoute';
import { ADMIN_ROUTE, LANDING_ROUTE } from '../../constants/routes';
import { userService } from '../../../infrastructure/services/UserService';
import { authService } from '../../../infrastructure/services/AuthenticationService';
import Snackbar from '../snackbar/Snackbar';

const LazyAdminRoute = React.lazy(() => import('../../../admin/AdminRoute'));

@inject('appStore')
@observer
class IndexRoute extends Component {
  state = {
    canRender: false,

    // snackbar
    open: false,
    variant: 'error',
    message: '',
  };

  getTags = async () => {
    const tags = await tagService.list();
    localStorage.setItem('tags', JSON.stringify(tags));
  };

  getUser = async () => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) return;

    try {
      await authService.checkToken();
      const user = await userService.getUserWithToken();
      this.props.appStore.setUser(user);
    } catch (e) {
      this.onChangeState({
        open: true,
        message: 'Token has expired. Please relog.',
      })();
    }
  };

  async componentDidMount () {
    await Promise.all([
      this.getTags(),
      this.getUser(),
    ]);
    this.setState({ canRender: true });
  }

  onChangeState = (metadata) => {
    return () => this.setState(metadata);
  };

  renderFallback = () => {
    return <div>Loading...</div>;
  };

  render() {
    const { canRender, open, message, variant } = this.state;

    if (!canRender) return null;

    return (
      <>
        <Suspense fallback={this.renderFallback()}>
          <Switch>
            <Route path={LANDING_ROUTE} component={PublicRoute} />
            <Route path={ADMIN_ROUTE} component={withAuth(LazyAdminRoute)} />
            <Redirect exact path='/' to={LANDING_ROUTE} />
          </Switch>
        </Suspense>

        <Snackbar
          open={open}
          onClose={this.onChangeState({ open: false })}
          message={message}
          variant={variant}
        />
      </>
    );
  }
}

IndexRoute.propTypes = {
  appStore: appStorePropTypes,
};

export default withRouter(withDefaultLayout(IndexRoute));

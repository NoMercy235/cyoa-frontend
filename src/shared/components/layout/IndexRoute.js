import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch, withRouter } from 'react-router-dom';
import { withDefaultLayout } from '../../hoc/DefaultLayout';
import { inject, observer } from 'mobx-react';
import { appStorePropTypes } from '../../store/AppStore';
import withAuth from '../../hoc/AuthRoute';
import { tagService } from '../../../infrastructure/services/TagService';
import PublicRoute from '../../../public/PublicRoute';
import { ADMIN_ROUTE, LANDING_ROUTE, NOT_FOUND_ROUTE } from '../../constants/routes';
import { userService } from '../../../infrastructure/services/UserService';
import { authService } from '../../../infrastructure/services/AuthenticationService';
import Snackbar from '../snackbar/Snackbar';
import NotFoundCmp from '../NotFoundCmp';

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
      // TODO: this doesn't work since the DOM is not loaded
      // this.snackbarRef.current.showSnackbar({
      //   variant: 'error',
      //   message: 'Token has expired. Please relog.',
      // });
    }
  };

  async componentDidMount () {
    await Promise.all([
      this.getTags(),
      this.getUser(),
    ]);
    this.setState({ canRender: true });
  }

  renderFallback = () => {
    return <div>Loading...</div>;
  };

  render() {
    const { canRender } = this.state;

    if (!canRender) return null;

    return (
      <>
        <Suspense fallback={this.renderFallback()}>
          <Switch>
            <Route path={LANDING_ROUTE} component={PublicRoute} />
            <Route path={ADMIN_ROUTE} component={withAuth(LazyAdminRoute)} />
            <Route path={NOT_FOUND_ROUTE} component={NotFoundCmp} />
            <Redirect exact path='/' to={LANDING_ROUTE} />
          </Switch>
        </Suspense>

        <Snackbar innerRef={this.snackbarRef}/>
      </>
    );
  }
}

IndexRoute.propTypes = {
  appStore: appStorePropTypes,
};

export default withRouter(withDefaultLayout(IndexRoute));

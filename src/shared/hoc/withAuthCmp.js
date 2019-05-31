import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';

export default function withAuthCmp(WrappedCmp) {
  @inject('appStore')
  @observer
  class AuthenticatedComponent extends Component {
    snackbarRef = React.createRef();

    getNewProps = () => {
      const newProps = Object.assign({}, this.props);
      delete newProps.staticContext;
      delete newProps.appStore;
      return newProps;
    };

    handleClick = () => {
      const {
        appStore: { isLoggedIn, setIsAuthModalOpen },
      } = this.props;

      if (isLoggedIn) {
        this.props.onClick && this.props.onClick();
      } else {
        setIsAuthModalOpen(true);
      }
    };

    render() {
      return (
        <WrappedCmp {...this.getNewProps()} onClick={this.handleClick} />
      );
    }
  }

  return AuthenticatedComponent;
}

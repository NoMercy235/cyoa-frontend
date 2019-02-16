import React, { Component, Fragment } from 'react';
import ConfirmationModal from '../components/confirmation/ConfirmationModal';
import { withStyles } from '@material-ui/core';
import { styles } from '../components/layout/Styles';
import * as PropTypes from 'prop-types';

export function withConfirmation(InnerComponent) {
  class Confirmation extends Component {
    state = {
      isOpen: false,
    };

    onAccept = () => {
      this.onHideModal();
      this.props.onClick();
    };

    onShowModal = () => {
      this.setState({ isOpen: true });
    };

    onHideModal = () => {
      this.setState({ isOpen: false });
    };

    render() {
      return (
        <Fragment>
          <InnerComponent
            onClick={this.onShowModal}
            {...this.props.innerProps}
          >
            {this.props.children}
          </InnerComponent>
          <ConfirmationModal
            title={this.props.title}
            description={this.props.description}
            open={this.state.isOpen}
            onClose={this.onHideModal}
            onAccept={this.onAccept}/>
        </Fragment>
      );
    }
  }

  Confirmation.propTypes = {
    classes: PropTypes.object,
    title: PropTypes.oneOfType([
      PropTypes.string, PropTypes.func, PropTypes.object,
    ]).isRequired,
    description: PropTypes.oneOfType([
      PropTypes.string, PropTypes.func, PropTypes.object,
    ]).isRequired,
    onClick: PropTypes.func,
    innerProps: PropTypes.object,
  };

  return withStyles(styles)(Confirmation);
}

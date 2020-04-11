import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';

import ConfirmationModal from '../components/confirmation/ConfirmationModal';

import { styles } from '../components/layout/Styles.css';

export function withModal(InnerComponent, Modal = ConfirmationModal) {
  class Confirmation extends Component {
    state = {
      isOpen: false,
      shouldDisableButtons: false,
    };

    onAccept = async e => {
      e.stopPropagation();
      const { onModalSubmit, onPreCondition } = this.props;
      if (onPreCondition) {
        this.setState({ shouldDisableButtons: true });
        const result = await onPreCondition();
        this.setState({ shouldDisableButtons: false });
        if (!result) return;
      }
      onModalSubmit();
      this.onHideModal();
    };

    onShowModal = (e) => {
      e.stopPropagation();
      const { onShowModal } = this.props;
      onShowModal && onShowModal();
      this.setState({ isOpen: true });
    };

    onHideModal = (e) => {
      e && e.stopPropagation();
      const { onHideModal } = this.props;
      onHideModal && onHideModal();
      this.setState({ isOpen: false });
    };

    render() {
      const { innerProps, children, title, description } = this.props;
      const { isOpen, shouldDisableButtons } = this.state;

      return (
        <>
          <InnerComponent
            onClick={this.onShowModal}
            {...innerProps}
          >
            {children}
          </InnerComponent>
          <Modal
            title={title}
            description={description}
            open={isOpen}
            onClose={this.onHideModal}
            onAccept={this.onAccept}
            disableNoBtn={shouldDisableButtons}
            disableYesBtn={shouldDisableButtons}
          />
        </>
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
    onShowModal: PropTypes.func,
    onHideModal: PropTypes.func,
    onModalSubmit: PropTypes.func,
    onPreCondition: PropTypes.func,
    innerProps: PropTypes.object,
  };

  return withStyles(styles)(Confirmation);
}

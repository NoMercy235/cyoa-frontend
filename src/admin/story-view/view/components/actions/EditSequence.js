import React, { Component, Fragment } from 'react';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import * as PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/es/Tooltip/Tooltip';
import { SequenceModel } from '../../../domain/models/SequenceModel';
import SaveSequenceModal from '../modals/save-sequence/SaveSequenceModal';

class EditSequence extends Component {
  state = {
    modalOpen: false,
  };

  onShowModal = () => {
    this.setState({ modalOpen: true });
  };

  onHideModal = () => {
    this.setState({ modalOpen: false });
  };

  render() {
    return (
      <Fragment>
        <IconButton
          onClick={this.onShowModal}
        >
          <Tooltip title="Edit">
            <EditIcon fontSize="small" />
          </Tooltip>
        </IconButton>
        <SaveSequenceModal
          open={this.state.modalOpen}
          onClose={this.onHideModal}
          sequence={this.props.sequence}
        />
      </Fragment>
    );
  }
}

EditSequence.propTypes = {
  sequence: PropTypes.instanceOf(SequenceModel).isRequired,
};

export default EditSequence;

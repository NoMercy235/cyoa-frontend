import React, { Component, Fragment } from 'react';
import SaveCollectionModal from '../modals/save-collection/SaveCollectionModal';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import * as PropTypes from 'prop-types';
import { CollectionModel } from '../../../domain/models/CollectionModel';
import Tooltip from '@material-ui/core/es/Tooltip/Tooltip';

class EditCollection extends Component {
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
        <SaveCollectionModal
          open={this.state.modalOpen}
          onClose={this.onHideModal}
          collection={this.props.collection}
        />
      </Fragment>
    );
  }
}

EditCollection.propTypes = {
  collection: PropTypes.instanceOf(CollectionModel).isRequired,
};

export default EditCollection;

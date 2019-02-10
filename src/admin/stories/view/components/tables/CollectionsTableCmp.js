import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { CollectionModel } from '../../../../../infrastructure/models/CollectionModel';
import { styles as tableStyles } from '../../../../../shared/components/table/TableCmp.css';
import { styles as collectionsTableStyles } from '../../../style/CollectionsTableCmp.css';
import TableCmp from '../../../../../shared/components/table/TableCmp';
import DeleteRow from '../../../../../shared/components/table/actions/DeleteRow';
import BasicEditAction from '../../../../../shared/components/form/BasicEditAction';
import SaveCollectionModal from '../modals/save-collection/SaveCollectionModal';
import BasicNewAction from '../../../../../shared/components/form/BasicNewAction';
import SelectedIcon from '@material-ui/icons/KeyboardArrowRight';
import { inject, observer } from 'mobx-react';
import { storyStorePropTypes } from '../../../stores/StoryStore';

@inject('storyStore')
@observer
class CollectionsTableCmp extends Component {
  state = {
    selectedCollection: '',
  };

  onChangeCollection = id => () => {
    this.setState({ selectedCollection: id });
    this.props.onChangeCollection(id);
    this.props.storyStore.setSelectedCollection(id);
  };

  onDeleteCollection = id => () => {
    this.props.onDeleteCollection(id);
  };

  renderName = row => {
    return (
      <span
        className={this.props.classes.clickableText}
        onClick={this.onChangeCollection(row._id)}
      >
        {this.state.selectedCollection === row._id && <SelectedIcon/>}
        {row.name}
      </span>
    );
  };

  getActions = (row, index) => {
    if (!index) return '';
    return (
      <div key={row._id} className={this.props.classes.actionsContainer}>
        <BasicEditAction
          resourceName="collection"
          resource={row}
          modalComponent={SaveCollectionModal}
        />
        <DeleteRow
          title="Delete confirmation"
          description="Are you sure you want to delete this collection?"
          onClick={this.onDeleteCollection(row._id)}
        />
      </div>
    );
  };

  render() {
    const columns = CollectionModel.getTableColumns();

    const data = [
      new CollectionModel({ name: 'Default' }),
      ...this.props.collections,
    ].map((c, i) => [
      this.renderName(c),
      this.getActions(c, i),
    ]);

    const options = {
      customToolbar: () => {
        return (
          <BasicNewAction
            tooltip="New collection"
            modalComponent={SaveCollectionModal}
          />
        );
      },
    };

    return (
      <TableCmp
        title="Collections"
        columns={columns}
        data={data}
        options={options}
      />
    );
  }
}

CollectionsTableCmp.propTypes = {
  classes: PropTypes.object,
  collections: PropTypes.arrayOf(PropTypes.shape(CollectionModel)),
  onChangeCollection: PropTypes.func.isRequired,
  onDeleteCollection: PropTypes.func.isRequired,

  storyStore: storyStorePropTypes,
};

export default withStyles(theme => ({
  ...tableStyles(theme),
  ...collectionsTableStyles(theme),
}))(CollectionsTableCmp);

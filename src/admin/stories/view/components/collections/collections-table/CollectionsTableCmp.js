import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { withStyles } from '@material-ui/core';
import SelectedIcon from '@material-ui/icons/KeyboardArrowRight';

import { CollectionModel } from '../../../../../../infrastructure/models/CollectionModel';
import TableCmp from '../../../../../../shared/components/table/TableCmp';
import DeleteRow from '../../../../../../shared/components/table/actions/DeleteRow';
import BasicEditAction from '../../../../../../shared/components/form/BasicEditAction';
import SaveCollectionModal from '../save-collection/SaveCollectionModal';
import BasicNewAction from '../../../../../../shared/components/form/BasicNewAction';
import { storyStorePropTypes } from '../../../../stores/StoryStore';
import { renderCollectionsTableTitle } from './CollectionsTableTitle';
import { COLLECTIONS_ADMIN_TABLE } from '../../../../../../shared/constants/tables';

import { styles as tableStyles } from '../../../../../../shared/components/table/TableCmp.css';
import { styles as collectionsTableStyles } from './CollectionsTableCmp.css';

@inject('storyStore')
@observer
class CollectionsTableCmp extends Component {
  state = {
    selectedCollection: '',
  };

  setSelectedCollection = id => {
    const { storyStore } = this.props;
    this.setState({ selectedCollection: id });
    storyStore.setSelectedCollection(id);
  };

  onChangeCollection = id => () => {
    const { onChangeCollection } = this.props;
    onChangeCollection(id);
    this.setSelectedCollection(id);
  };

  onDeleteCollection = id => async () => {
    const { onDeleteCollection } = this.props;
    const { selectedCollection } = this.state;
    await onDeleteCollection(id);
    if (id === selectedCollection) {
      this.onChangeCollection('')();
    }
  };

  renderName = row => {
    const { classes } = this.props;
    const { selectedCollection } = this.state;
    return (
      <span
        className={classes.clickableText}
        onClick={this.onChangeCollection(row.id)}
      >
        {selectedCollection === row.id && <SelectedIcon/>}
        {row.name}
      </span>
    );
  };

  getActions = (row, index) => {
    if (!index) return '';
    const { classes } = this.props;
    return (
      <div key={row.id} className={classes.actionsContainer}>
        <BasicEditAction
          resourceName="collection"
          resource={row}
          modalComponent={SaveCollectionModal}
        />
        <DeleteRow
          title="Delete confirmation"
          description="Are you sure you want to delete this collection?"
          onClick={this.onDeleteCollection(row.id)}
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
        id={COLLECTIONS_ADMIN_TABLE}
        title={renderCollectionsTableTitle()}
        columns={columns}
        data={data}
        options={options}
      />
    );
  }
}

CollectionsTableCmp.propTypes = {
  classes: PropTypes.object,
  collections: PropTypes.arrayOf(PropTypes.instanceOf(CollectionModel)),
  onChangeCollection: PropTypes.func.isRequired,
  onDeleteCollection: PropTypes.func.isRequired,

  storyStore: storyStorePropTypes,
};

export default withStyles(theme => ({
  ...tableStyles(theme),
  ...collectionsTableStyles(theme),
}))(CollectionsTableCmp);

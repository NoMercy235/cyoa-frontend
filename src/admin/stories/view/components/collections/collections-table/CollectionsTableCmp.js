import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { withStyles } from '@material-ui/core';
import SelectedIcon from '@material-ui/icons/KeyboardArrowRight';

import { CollectionModel } from '../../../../../../infrastructure/models/CollectionModel';
import TableCmp from '../../../../../../shared/components/table/TableCmp';
import DeleteRow from '../../../../../../shared/components/table/actions/DeleteRow';
import BasicEditAction from '../../../../../../shared/components/form/BasicEditAction';
import SaveCollectionModal from '../save-collection/SaveCollectionModal';
import BasicNewAction from '../../../../../../shared/components/form/BasicNewAction';
import { renderCollectionsTableTitle } from './CollectionsTableTitle';
import { COLLECTIONS_ADMIN_TABLE } from '../../../../../../shared/constants/tables';

import { styles as tableStyles } from '../../../../../../shared/components/table/TableCmp.css';
import { styles as collectionsTableStyles } from './CollectionsTableCmp.css';

@observer
class CollectionsTableCmp extends Component {
  onChangeCollection = id => () => {
    this.props.onChangeCollection(id);
  };

  onDeleteCollection = id => async () => {
    const {
      selectedCollection,
      onDeleteCollection,
    } = this.props;
    await onDeleteCollection(id);
    // If the deleted collection is the currentSelected one, set the
    // current selection to Default
    if (id === selectedCollection) {
      this.onChangeCollection('')();
    }
  };

  renderName = row => {
    const {
      selectedCollection,
      classes,
    } = this.props;
    return (
      <span
        className={classes.clickableText}
        onClick={this.onChangeCollection(row._id)}
      >
        {selectedCollection === row._id && <SelectedIcon/>}
        {row.name}
      </span>
    );
  };

  getActions = (row, index) => {
    if (!index) return '';
    const { classes } = this.props;
    return (
      <div key={row._id} className={classes.actionsContainer}>
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
  selectedCollection: PropTypes.string,
  onChangeCollection: PropTypes.func.isRequired,
  onDeleteCollection: PropTypes.func.isRequired,
};

export default withStyles(theme => ({
  ...tableStyles(theme),
  ...collectionsTableStyles(theme),
}))(CollectionsTableCmp);

import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { CollectionModel } from '../../../domain/models/CollectionModel';
import { styles as tableStyles } from '../../../../../shared/components/table/TableCmp.css';
import { styles as collectionsTableStyles } from '../../../style/CollectionsTableCmp.css';
import EditCollection from '../actions/EditCollections';
import NewCollection from '../actions/NewCollection';
import TableCmp from '../../../../../shared/components/table/TableCmp';
import DeleteRow from '../../../../../shared/components/table/actions/DeleteRow';

class CollectionsTableCmp extends Component {
  onChangeCollection = id => () => {
    this.props.onChangeCollection(id);
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
        {row.name}
      </span>
    );
  };

  getActions = (row, index) => {
    if (!index) return '';
    return (
      <div key={row._id} className={this.props.classes.actionsContainer}>
        <EditCollection collection={row}/>
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
        return <NewCollection />;
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
};

export default withStyles(theme => ({
  ...tableStyles(theme),
  ...collectionsTableStyles(theme),
}))(CollectionsTableCmp);

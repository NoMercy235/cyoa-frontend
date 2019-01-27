import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { styles as storiesTableStyles } from '../../../style/StoriesTableCmp.css';
import { styles as tableStyles } from '../../../../../shared/components/table/TableCmp.css';
import { StoryModel } from '../../../domain/models/StoryModel';
import classNames from 'classnames';
import { TableCell } from '../../../../../shared/components/table/TableCell';
import { TagModel } from '../../../../../shared/domain/models/TagModel';
import DeleteIcon from '@material-ui/icons/Delete';
import sharedClasses from '../../../../../shared/components/table/TableContainer.module.scss';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { withConfirmation } from '../../../../../shared/hoc/withConfirmation';
import EditStory from '../actions/EditStory';
import { withRouter } from 'react-router-dom';
import VisibilityIcon from '@material-ui/icons/Visibility';

const IconButtonHOC = withConfirmation(IconButton);

class StoriesTableCmp extends Component {
  tags = TagModel.get();

  renderTags(tags) {
    return tags
      .map(st => {
        const tag = this.tags.find(t => t._id === st);
        return tag ? tag.name : st;
      })
      .join(', ');
  }

  onDeleteStory = id => () => {
    this.props.onDeleteStory(id);
  };

  onSelect = (history, row) => () => {
    history.push(`stories/${row._id}`);
  };

  renderName = row => {
    const { classes } = this.props;
    const Name = withRouter(({ history }) => (
      <Tooltip title={row.name} enterDelay={1000}>
        <span
          className={classNames(classes.clickableText, classes.storyName)}
          onClick={this.onSelect(history, row)}
        >
          {row.name}
        </span>
      </Tooltip>
    ));
    return <Name />;
  };

  renderSeeIcon = row => {
    const Icon = withRouter(({ history }) => (
      <IconButton
        onClick={this.onSelect(history, row)}
      >
        <VisibilityIcon fontSize="small" />
      </IconButton>
    ));
    return <Icon />;
  };

  render() {
    const { classes } = this.props;

    return (
      <Paper className={classNames(classes.root, classes.storiesTable)}>
        <Table className={classes.table}>
          <TableHead className={classes.header}>
            <TableRow className={classes.thead}>
              {StoryModel.getTableColumns().map((column, i) =>
                <TableCell
                  className={classes.cell}
                  key={i}
                >
                  {column.label}
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {this.props.stories.map(row =>
              <TableRow
                className={classNames(classes.row, sharedClasses.row)}
                key={row._id}
                hover={true}
              >
                <TableCell className={classes.cell} scope="row">
                  {this.renderName(row)}
                </TableCell>
                <TableCell
                  className={classes.cell}
                  align="right"
                >
                  <span
                    className={classes.textWithActionsContainer}
                  >
                    {this.renderTags(row.tags)}
                  </span>
                  <div className={sharedClasses.actionsContainer}>
                    {this.renderSeeIcon(row)}
                    <EditStory story={row} />
                    <IconButtonHOC
                      title="Delete confirmation"
                      description="Are you sure you want to delete this story?"
                      onClick={this.onDeleteStory(row._id)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButtonHOC>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    );
  }
}

StoriesTableCmp.propTypes = {
  classes: PropTypes.object,
  stories: PropTypes.arrayOf(PropTypes.shape(StoryModel)),
  onDeleteStory: PropTypes.func.isRequired,
};

export default withStyles(theme => ({
  ...tableStyles(theme),
  ...storiesTableStyles(theme),
}))(StoriesTableCmp);

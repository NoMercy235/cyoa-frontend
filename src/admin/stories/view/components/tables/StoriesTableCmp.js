import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { styles as storiesTableStyles } from '../../../style/StoriesTableCmp.css';
import { styles as tableStyles } from '../../../../../shared/components/table/TableCmp.css';
import { StoryModel } from '../../../domain/models/StoryModel';
import classNames from 'classnames';
import { TagModel } from '../../../../../shared/domain/models/TagModel';
import DeleteIcon from '@material-ui/icons/Delete';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import { withConfirmation } from '../../../../../shared/hoc/withConfirmation';
import EditStory from '../actions/EditStory';
import { withRouter } from 'react-router-dom';
import VisibilityIcon from '@material-ui/icons/Visibility';
import TableCmp from '../../../../../shared/components/table/TableCmp';
import NewStory from '../actions/NewStory';

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

  getActions = row => {
    return (
      <div key={row._id} className={this.props.classes.actionsContainer}>
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
    );
  };

  render() {
    const { stories } = this.props;
    const columns = StoryModel.getTableColumns();

    const data = stories.map(s => {
      return [
        this.renderName(s),
        this.renderTags(s.tags),
        this.getActions(s),
      ];
    });

    const options = {
      filter: false,
      customToolbar: () => {
        return <NewStory />;
      },
    };

    return (
      <TableCmp
        title="Stories"
        columns={columns}
        data={data}
        options={options}
      />
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

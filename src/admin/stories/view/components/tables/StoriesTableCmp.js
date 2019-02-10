import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { styles as storiesTableStyles } from '../../../style/StoriesTableCmp.css';
import { styles as tableStyles } from '../../../../../shared/components/table/TableCmp.css';
import { StoryModel } from '../../../../../infrastructure/models/StoryModel';
import classNames from 'classnames';
import { TagModel } from '../../../../../shared/domain/models/TagModel';
import Tooltip from '@material-ui/core/Tooltip';
import { withRouter } from 'react-router-dom';
import TableCmp from '../../../../../shared/components/table/TableCmp';
import ViewRow from '../../../../../shared/components/table/actions/ViewRow';
import DeleteRow from '../../../../../shared/components/table/actions/DeleteRow';
import BasicNewAction from '../../../../../shared/components/form/BasicNewAction';
import SaveStoryModal from '../modals/save-story/SaveStoryModal';
import BasicEditAction from '../../../../../shared/components/form/BasicEditAction';
import { observer } from 'mobx-react';
import { ADMIN_STORY_VIEW_ROUTE, makePath } from '../../../../../shared/constants/routes';

@observer
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
    const path = makePath(ADMIN_STORY_VIEW_ROUTE, { ':id': row._id });
    history.push(path);
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
      <ViewRow onClick={this.onSelect(history, row)}/>
    ));
    return <Icon />;
  };

  getActions = row => {
    return (
      <div key={row._id} className={this.props.classes.actionsContainer}>
        {this.renderSeeIcon(row)}
        <BasicEditAction
          resourceName="story"
          resource={row}
          modalComponent={SaveStoryModal}
        />
        <DeleteRow
          title="Delete confirmation"
          description="Are you sure you want to delete this story?"
          onClick={this.onDeleteStory(row._id)}
        />
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
      customToolbar: () => {
        return (
          <BasicNewAction
            tooltip="New story"
            modalComponent={SaveStoryModal}
          />
        );
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

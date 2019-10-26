import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles, Tooltip } from '@material-ui/core';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import { observer } from 'mobx-react';

import { StoryModel } from '../../../../../../infrastructure/models/StoryModel';
import TableCmp from '../../../../../../shared/components/table/TableCmp';
import ViewRow from '../../../../../../shared/components/table/actions/ViewRow';
import DeleteRow from '../../../../../../shared/components/table/actions/DeleteRow';
import BasicNewAction from '../../../../../../shared/components/form/BasicNewAction';
import SaveStoryModal from '../save-story/SaveStoryModal';
import BasicEditAction from '../../../../../../shared/components/form/BasicEditAction';
import { ADMIN_STORY_VIEW_ROUTE, makePath } from '../../../../../../shared/constants/routes';
import { renderStoriesTableTitle } from './StoriesTableTitle';
import YesNoCmp from '../../../../../../shared/components/table/YesNoCmp';
import withDisabledStoryPublished from '../../../../../../shared/hoc/withDisabledStoryPublished';
import { STORIES_ADMIN_TABLE } from '../../../../../../shared/constants/tables';
import PublishBtn from '../../../../../story-view/view/components/general/PublishBtn';

import { styles as storiesTableStyles } from './StoriesTableCmp.css';
import { styles as tableStyles } from '../../../../../../shared/components/table/TableCmp.css';

const BasicEditBtnWithDisabledState = withDisabledStoryPublished(BasicEditAction);
const BasicDeleteBtnWithDisabledState = withDisabledStoryPublished(DeleteRow);

@observer
class StoriesTableCmp extends Component {
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

  renderIsOffline = row => {
    return <YesNoCmp condition={row.isAvailableOffline}/>;
  };

  renderIsPublished = row => {
    return <YesNoCmp condition={row.published}/>;
  };

  getActions = row => {
    const { classes, onChangePublishState } = this.props;
    return (
      <div key={row._id} className={classes.actionsContainer}>
        {this.renderSeeIcon(row)}
        <PublishBtn story={row} onPublishStateChanged={onChangePublishState}/>
        <BasicEditBtnWithDisabledState
          resourceName="story"
          resource={row}
          modalComponent={SaveStoryModal}
          storyPublished={row.published}
        />
        <BasicDeleteBtnWithDisabledState
          title="Delete confirmation"
          description="Are you sure you want to delete this story?"
          onClick={this.onDeleteStory(row._id)}
          storyPublished={row.published}
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
        s.tagsName.join(', '),
        this.renderIsOffline(s),
        this.renderIsPublished(s),
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
        id={STORIES_ADMIN_TABLE}
        title={renderStoriesTableTitle()}
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
  onChangePublishState: PropTypes.func.isRequired,
};

export default withStyles(theme => ({
  ...tableStyles(theme),
  ...storiesTableStyles(theme),
}))(StoriesTableCmp);

import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Paper, withStyles } from '@material-ui/core';
import { styles as customStyles } from './ChapterListCmp.css';
import { inject, observer } from 'mobx-react';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ChapterItem from './ChapterItem';
import BasicNewAction from '../../../../../../shared/components/form/BasicNewAction';
import { renderChaptersListTitle } from './ChaptersListTitle';
import SaveChapterModal from '../save-chapter/SaveChapterModal';
import { storyViewStorePropTypes } from '../../../../stores/StoryViewStore';
import { chapterService } from '../../../../../../infrastructure/services/ChapterService';

@inject('storyViewStore')
@observer
class ChapterListCmp extends Component {
  getChapters = async () => {
    const filters = {
      parentChapter: { op: 'equals', value: '', options: { allowEmpty: true } },
    };
    const chapters = await chapterService.list(filters);
    this.props.storyViewStore.setChapters(chapters);
  };

  componentDidMount () {
    this.getChapters();
  }

  render() {
    const { classes, className } = this.props;
    const { chapters } = this.props.storyViewStore;

    return (
      <Paper elevation={2} className={className}>
        <Typography
          className={classes.listTitle}
          variant="h6"
          color="inherit"
          noWrap
        >
          <span>{renderChaptersListTitle()}</span>
          <BasicNewAction
            className={classes.chapterAddBtn}
            tooltip="New chapter"
            modalComponent={SaveChapterModal}
          />
        </Typography>
        <List
          component="nav"
          className={classes.root}
        >
          {chapters.map((c, i) => (
            <ChapterItem key={i} chapter={c}/>
          ))}
        </List>
      </Paper>
    );
  }
}

ChapterListCmp.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object,
  storyViewStore: storyViewStorePropTypes,
};

export default withStyles(customStyles)(ChapterListCmp);

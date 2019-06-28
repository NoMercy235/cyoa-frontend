import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles, Paper, List, Typography } from '@material-ui/core';
import { observer } from 'mobx-react';

import ChapterItem from './ChapterItem';
import BasicNewAction from '../../../../../../shared/components/form/BasicNewAction';
import { renderChaptersListTitle } from './ChaptersListTitle';
import SaveChapterModal from '../save-chapter/SaveChapterModal';
import { ChapterModel } from '../../../../../../infrastructure/models/ChapterModel';
import withDisabledStoryPublished from '../../../../../../shared/hoc/withDisabledStoryPublished';

import { styles as customStyles } from './ChapterListCmp.css';

const BasicNewBtnWithDisabledState = withDisabledStoryPublished(BasicNewAction);

@observer
class ChapterListCmp extends Component {
  render() {
    const { classes, chapters, selectedChapterId, className } = this.props;

    const chaptersWithDefault = [
      new ChapterModel({ _id: '', name: 'Default' }),
      ...chapters,
    ];

    return (
      <Paper elevation={2} className={className}>
        <Typography
          className={classes.listTitle}
          variant="h6"
          color="inherit"
          noWrap
        >
          <span>{renderChaptersListTitle()}</span>
          <BasicNewBtnWithDisabledState
            className={classes.chapterAddBtn}
            tooltip="New chapter"
            modalComponent={SaveChapterModal}
          />
        </Typography>
        <List
          dense={true}
          component="nav"
          className={classes.root}
        >
          {chaptersWithDefault.map((c, i) => (
            <ChapterItem
              key={i}
              chapter={c}
              selectedChapterId={selectedChapterId}
              onDeleteRow={this.props.onDeleteChapter}
              onClick={this.props.onChapterClick}
            />
          ))}
        </List>
      </Paper>
    );
  }
}

ChapterListCmp.propTypes = {
  className: PropTypes.string,
  classes: PropTypes.object,
  chapters: PropTypes.arrayOf(PropTypes.instanceOf(ChapterModel)).isRequired,
  selectedChapterId: PropTypes.string.isRequired,
  onDeleteChapter: PropTypes.func.isRequired,
  onChapterClick: PropTypes.func.isRequired,
};

export default withStyles(customStyles)(ChapterListCmp);

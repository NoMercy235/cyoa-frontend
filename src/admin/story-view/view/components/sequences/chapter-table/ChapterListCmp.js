import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Paper, withStyles } from '@material-ui/core';
import { styles as customStyles } from './ChapterListCmp.css';
import { observer } from 'mobx-react';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import ChapterItem from './ChapterItem';
import BasicNewAction from '../../../../../../shared/components/form/BasicNewAction';
import { renderChaptersListTitle } from './ChaptersListTitle';
import SaveChapterModal from '../save-chapter/SaveChapterModal';
import { ChapterModel } from '../../../../../../infrastructure/models/ChapterModel';

@observer
class ChapterListCmp extends Component {
  render() {
    const { classes, chapters, className } = this.props;

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
            <ChapterItem
              key={i}
              chapter={c}
              onDeleteRow={this.props.onDeleteChapter}
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
  onDeleteChapter: PropTypes.func.isRequired,
};

export default withStyles(customStyles)(ChapterListCmp);

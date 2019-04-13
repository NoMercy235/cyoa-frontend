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

const chapters = [
  { name: 'Chapter 1', subChapters: [] },
  { name: 'Chapter 2', subChapters: [] },
  {
    name: 'Chapter 3',
    subChapters: [
      {
        name: 'Subchapter 1',
        subChapters: [
          { name: 'Subsubchapter 1', subChapters: [] },
          { name: 'Subsubchapter 2', subChapters: [] },
        ],
      },
      { name: 'Subchapter 2', subChapters: [] },
    ],
  },
  { name: 'Chapter 4', subChapters: [] },
];

@observer
class ChapterListCmp extends Component {
  render() {
    const { classes, className } = this.props;

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
            modalComponent={() => <div/>}
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
};

export default withStyles(customStyles)(ChapterListCmp);

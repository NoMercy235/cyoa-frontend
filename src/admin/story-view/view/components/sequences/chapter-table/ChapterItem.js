import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { styles as customStyles } from './ChapterListCmp.css';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import DeleteRow from '../../../../../../shared/components/table/actions/DeleteRow';
import Tooltip from '@material-ui/core/Tooltip';
import SaveChapterModal from '../save-chapter/SaveChapterModal';
import BasicEditAction from '../../../../../../shared/components/form/BasicEditAction';
import SelectedIcon from '@material-ui/icons/KeyboardArrowRight';
import IconButton from '@material-ui/core/IconButton';

class ChapterItem extends Component {
  state = {
    open: false,
  };

  handleClick = () => {
    this.props.onClick(this.props.chapter._id);
  };

  isDefaultChapter = () => {
    return !this.props.chapter._id;
  };

  onDeleteRow = () => {
    this.props.onDeleteRow(this.props.chapter._id);
  };

  renderIsSelected = () => {
    const { chapter, selectedChapterId } = this.props;
    if (chapter._id !== selectedChapterId) return null;
    return <SelectedIcon/>;
  };

  renderName = () => {
    const { chapter } = this.props;
    return (
      <Tooltip title={chapter.name}>
        <span>{chapter.name}</span>
      </Tooltip>
    );
  };

  renderEditAction = () => {
    const { chapter } = this.props;
    return !this.isDefaultChapter() && (
      <BasicEditAction
        resourceName="chapter"
        resource={chapter}
        modalComponent={SaveChapterModal}
        innerProps={{ chapter }}
      />
    );
  };

  renderDeleteAction = () => {
    return !this.isDefaultChapter() && (
      <DeleteRow
        title="Delete confirmation"
        description="Are you sure you want to delete this chapter?"
        onClick={this.onDeleteRow}
      />
    );
  };

  onExpandClick = e => {
    this.setState(state => ({ open: !state.open }));
    e.stopPropagation();
  };

  renderExpand = () => {
    const { chapter } = this.props;
    if (!chapter.subChapters.length) return null;

    const Expand = this.state.open ? ExpandLess : ExpandMore;
    return (
      <IconButton onClick={this.onExpandClick}>
        <Expand />
      </IconButton>
    );
  };

  render() {
    const { classes, chapter, selectedChapterId } = this.props;

    return (
      <>
        <ListItem
          className={classes.listItem}
          button
          onClick={this.handleClick}
          disableRipple={true}
        >
          {this.renderIsSelected()}
          <ListItemText
            className={classes.chapterName}
            inset
            primary={this.renderName()}
          />
          {this.renderEditAction()}
          {this.renderDeleteAction()}
          {this.renderExpand()}
        </ListItem>
        <Collapse
          in={!!chapter.subChapters.length && this.state.open}
          timeout="auto"
          unmountOnExit
        >
          <List component="div" disablePadding className={classes.nested}>
            {chapter.subChapters.map((c, i) => (
              <ChapterItem
                key={i}
                chapter={c}
                classes={classes}
                selectedChapterId={selectedChapterId}
                onDeleteRow={this.props.onDeleteRow}
                onClick={this.props.onClick}
              />
            ))}
          </List>
        </Collapse>
      </>
    );
  }
}

ChapterItem.propTypes = {
  classes: PropTypes.object,
  chapter: PropTypes.object.isRequired,
  selectedChapterId: PropTypes.string.isRequired,
  onDeleteRow: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default withStyles(customStyles)(ChapterItem);

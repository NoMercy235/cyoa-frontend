import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import { styles as customStyles } from './ChapterListCmp.css';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Collapse from '@material-ui/core/Collapse';
import BookIcon from '@material-ui/icons/Book';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import DeleteRow from '../../../../../../shared/components/table/actions/DeleteRow';

class ChapterItem extends Component {
  state = {
    open: false,
  };

  handleClick = () => {
    this.setState(state => ({ open: !state.open }));
  };

  onDeleteRow = () => {
    this.props.onDeleteRow(this.props.chapter._id);
  };

  renderExpand = () => {
    const { chapter } = this.props;
    if (!chapter.subChapters.length) return null;

    return this.state.open ? <ExpandLess /> : <ExpandMore />;
  };

  render() {
    const { classes, chapter } = this.props;

    return (
      <>
        <ListItem
          button
          onClick={this.handleClick}
        >
          <ListItemIcon>
            <BookIcon />
          </ListItemIcon>
          <ListItemText inset primary={chapter.name}/>

          <DeleteRow
            title="Delete confirmation"
            description="Are you sure you want to delete this collection?"
            onClick={this.onDeleteRow}
          />
          {this.renderExpand()}
        </ListItem>
        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding className={classes.nested}>
            {chapter.subChapters.map((c, i) => (
              <ChapterItem
                key={i}
                chapter={c}
                classes={classes}
                onDeleteRow={this.props.onDeleteRow}
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
  onDeleteRow: PropTypes.func.isRequired,
};

export default withStyles(customStyles)(ChapterItem);

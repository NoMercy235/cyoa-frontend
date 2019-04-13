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

class ChapterItem extends Component {
  state = {
    open: false,
  };

  handleClick = () => {
    this.setState(state => ({ open: !state.open }));
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
          {this.renderExpand()}
        </ListItem>
        <Collapse in={this.state.open} timeout="auto" unmountOnExit>
          <List component="div" disablePadding className={classes.nested}>
            {chapter.subChapters.map((c, i) => (
              <ChapterItem
                key={i}
                chapter={c}
                classes={classes}
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
  chapter: PropTypes.object,
};

export default withStyles(customStyles)(ChapterItem);

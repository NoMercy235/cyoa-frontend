import React from 'react';
import * as PropTypes from 'prop-types';
import {
  ClickAwayListener,
  Grow,
  MenuItem,
  MenuList,
  Paper,
  Popper,
} from '@material-ui/core';

class MenuDropdown extends React.Component {
  static defaultProps = {
    placement: 'bottom',
    closeOnItemClick: true,
  };

  state = {
    open: false,
  };

  handleToggle = () => {
    this.setState(state => ({ open: !state.open }));
  };

  handleClose = event => {
    if (this.anchorEl.contains(event.target)) {
      return;
    }
    this.setState({ open: false });
  };

  onItemClick = event => {
    if (this.props.closeOnItemClick) {
      this.handleClose(event);
    }
  };

  renderItem = (item, index) => {
    return (
      <MenuItem
        key={index}
        onClick={this.onItemClick}
      >
        {item}
      </MenuItem>
    );
  };

  render() {
    const { className, children, items, placement } = this.props;
    const { open } = this.state;

    return (
      <>
        <div
          ref={node => {
            this.anchorEl = node;
          }}
          className={className}
          aria-owns={open ? 'menu-list-grow' : undefined}
          aria-haspopup="true"
          onClick={this.handleToggle}
        >
          {children}
        </div>
        <Popper
          open={open}
          anchorEl={this.anchorEl}
          transition
          disablePortal
          placement={placement}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="menu-list-grow"
              style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
            >
              <Paper>
                <ClickAwayListener onClickAway={this.handleClose}>
                  <MenuList>
                    {items.map(this.renderItem)}
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </>
    );
  }
}

MenuDropdown.propTypes = {
  className: PropTypes.string,
  placement: PropTypes.oneOf([
    'bottom-end',
    'bottom-start',
    'bottom',
    'left-end',
    'left-start',
    'left',
    'right-end',
    'right-start',
    'right',
    'top-end',
    'top-start',
    'top',
  ]),
  items: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.element,
    ])
  ).isRequired,
  closeOnItemClick: PropTypes.bool,
};

export default MenuDropdown;

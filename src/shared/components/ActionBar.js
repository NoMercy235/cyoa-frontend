import React, { Component, Fragment } from 'react';

class ActionBar extends Component {
  render() {
    return (
      <Fragment>
        {this.props.children}
      </Fragment>
    );
  }
}

ActionBar.propTypes = {
};

export default ActionBar;

import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import * as PropTypes from 'prop-types';

@inject('testStore')
@observer
class LandingCmp extends Component {
  constructor(props) {
    super(props);
    this.index = 0;
  }

  changeName = () => {
    this.props.testStore.changeName('abc: ' + this.index);
    this.index ++;
  };

  render() {
    return (
      <Fragment>
        <p>test me pls</p>
        <button onClick={this.changeName}>
          Click here to change the name
        </button>
        <p>{ this.props.testStore.name.get() }</p>
      </Fragment>
    );
  }
}

LandingCmp.propTypes = {
  testStore: PropTypes.object,
};

export default LandingCmp;

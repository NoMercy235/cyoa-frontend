import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { LANDING_ROUTE } from '../../../../../shared/constants/routes';
import { withRouter } from 'react-router-dom';

class StoryFinished extends Component {
  goToHome = () => {
    this.props.history.push(LANDING_ROUTE);
  };

  render() {
    return (
      <div>
        Story finished! Congrats!
      </div>
    );
  }
}

StoryFinished.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};

export default withRouter(StoryFinished);

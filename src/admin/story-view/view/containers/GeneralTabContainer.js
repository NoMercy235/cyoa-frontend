import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { StoryModel } from '../../../../infrastructure/models/StoryModel';
import GeneralTab from '../components/general-tab/GeneralTab';

class GeneralTabContainer extends Component {
  render() {
    const { story } = this.props;
    return (
      <Fragment>
        <GeneralTab story={story}/>
      </Fragment>
    );
  }
}

GeneralTabContainer.propTypes = {
  story: PropTypes.shape(StoryModel).isRequired,
};

export default GeneralTabContainer;

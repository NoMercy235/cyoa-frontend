import React, { Component, Fragment } from 'react';
import AttributesTableCmp from '../components/tables/AttributesTableCmp';
import { attributeService } from '../../domain/services/AttributeService';
import * as PropTypes from 'prop-types';
import { StoryModel } from '../../../stories/domain/models/StoryModel';
import { inject, observer } from 'mobx-react';
import { storyViewStorePropTypes } from '../../domain/stores/StoryViewStore';

@inject('storyViewStore')
@observer
class PlayerTabContainer extends Component {
  onSelectAttribute = id => {
    console.log('Selected: ', id);
  };

  onDeleteAttribute = id => {
    console.log('Delete: ', id);
  };

  getAttributes = async () => {
    const params = { ':story': this.props.story._id };
    const attributes = await attributeService.list({}, params);
    this.props.storyViewStore.setAttributes(attributes);
  };

  componentDidMount () {
    this.getAttributes();
  }

  render() {
    const { attributes } = this.props.storyViewStore;
    return (
      <Fragment>
        <AttributesTableCmp
          attributes={attributes}
          onSelectAttribute={this.onSelectAttribute}
          onDeleteAttribute={this.onDeleteAttribute}
        />
      </Fragment>
    );
  }
}

PlayerTabContainer.propTypes = {
  story: PropTypes.shape(StoryModel),

  storyViewStore: storyViewStorePropTypes,
};

export default PlayerTabContainer;

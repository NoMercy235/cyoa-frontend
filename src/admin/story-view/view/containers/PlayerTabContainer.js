import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';

import AttributesTableCmp from '../components/player/AttributesTableCmp';
import { attributeService } from '../../../../infrastructure/services/AttributeService';
import { StoryModel } from '../../../../infrastructure/models/StoryModel';
import { storyViewStorePropTypes } from '../../stores/StoryViewStore';
import Snackbar, { SnackbarEnum } from '../../../../shared/components/snackbar/Snackbar';

import classes from './PlayerTabContainer.module.scss';

@inject('storyViewStore')
@observer
class PlayerTabContainer extends Component {
  snackbarRef = React.createRef();

  onSelectAttribute = id => {
    console.log('Selected: ', id);
  };

  onEditAttribute = id => {
    const params = { ':story': this.props.story._id };
    attributeService.setNextRouteParams(params);

    return async () => {
      const attr =  await attributeService.get(id);
      if (attr.linkedEnding) {
        attr.linkedEnding = {
          value: attr.linkedEnding._id,
          label: attr.linkedEnding.name,
        };
      }
      return attr;
    };
  };

  onDeleteAttribute = async attributeId => {
    const params = { ':story': this.props.story._id };
    attributeService.setNextRouteParams(params);
    await this.snackbarRef.current.executeAndShowSnackbar(
      attributeService.delete,
      [attributeId],
      {
        variant: SnackbarEnum.Variants.Success,
        message: 'Attribute deleted!',
      },
    );
    this.props.storyViewStore.removeAttribute(attributeId);
  };

  componentDidMount () {
    this.props.getAttributes();
  }

  render() {
    const { attributes } = this.props.storyViewStore;
    return (
      <>
        <div className={classes.tableContainer}>
          <AttributesTableCmp
            attributes={attributes}
            onEditAttribute={this.onEditAttribute}
            onSelectAttribute={this.onSelectAttribute}
            onDeleteAttribute={this.onDeleteAttribute}
          />
        </div>
        <Snackbar innerRef={this.snackbarRef}/>
      </>
    );
  }
}

PlayerTabContainer.propTypes = {
  story: PropTypes.instanceOf(StoryModel).isRequired,
  getAttributes: PropTypes.func.isRequired,

  storyViewStore: storyViewStorePropTypes,
};

export default PlayerTabContainer;

import React, { Component, Fragment } from 'react';
import AttributesTableCmp from '../components/player/AttributesTableCmp';
import { attributeService } from '../../../../infrastructure/services/AttributeService';
import * as PropTypes from 'prop-types';
import { StoryModel } from '../../../../infrastructure/models/StoryModel';
import { inject, observer } from 'mobx-react';
import { storyViewStorePropTypes } from '../../stores/StoryViewStore';
import { withSnackbar } from '../../../../shared/components/form/helpers';
import Snackbar from '../../../../shared/components/snackbar/Snackbar';
import classes from './PlayerTabContainer.module.scss';

@inject('storyViewStore')
@observer
class PlayerTabContainer extends Component {
  state = {
    // snackbar
    open: false,
    variant: 'success',
    message: '',
  };

  onChangeState = (metadata) => {
    return () => this.setState(metadata);
  };

  onSelectAttribute = id => {
    console.log('Selected: ', id);
  };

  onDeleteAttribute = async attributeId => {
    const params = { ':story': this.props.story._id };
    attributeService.setNextRouteParams(params);
    await withSnackbar.call(
      this,
      attributeService.delete,
      [attributeId],
      'Attribute deleted'
    );
    this.props.storyViewStore.removeAttribute(attributeId);
  };

  componentDidMount () {
    this.props.getAttributes();
  }

  render() {
    const { attributes } = this.props.storyViewStore;
    const { open, message, variant } = this.state;
    return (
      <Fragment>
        <div className={classes.tableContainer}>
          <AttributesTableCmp
            attributes={attributes}
            onSelectAttribute={this.onSelectAttribute}
            onDeleteAttribute={this.onDeleteAttribute}
          />
        </div>
        <Snackbar
          open={open}
          onClose={this.onChangeState({ open: false })}
          message={message}
          variant={variant}
        />
      </Fragment>
    );
  }
}

PlayerTabContainer.propTypes = {
  story: PropTypes.instanceOf(StoryModel).isRequired,
  getAttributes: PropTypes.func.isRequired,

  storyViewStore: storyViewStorePropTypes,
};

export default PlayerTabContainer;

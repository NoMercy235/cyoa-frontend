import React, { Component, Fragment } from 'react';
import AttributesTableCmp from '../components/player/AttributesTableCmp';
import { attributeService } from '../../../../infrastructure/services/AttributeService';
import * as PropTypes from 'prop-types';
import { StoryModel } from '../../../../infrastructure/models/StoryModel';
import { inject, observer } from 'mobx-react';
import { storyViewStorePropTypes } from '../../stores/StoryViewStore';
import Snackbar from '../../../../shared/components/snackbar/Snackbar';
import classes from './PlayerTabContainer.module.scss';

@inject('storyViewStore')
@observer
class PlayerTabContainer extends Component {
  snackbarRef = React.createRef();

  onSelectAttribute = id => {
    console.log('Selected: ', id);
  };

  onDeleteAttribute = async attributeId => {
    const params = { ':story': this.props.story._id };
    attributeService.setNextRouteParams(params);
    await this.snackbarRef.current.executeAndShowSnackbar(
      attributeService.delete.bind(null, attributeId),
      { variant: 'success', message: 'Attribute deleted!' },
    );
    this.props.storyViewStore.removeAttribute(attributeId);
  };

  componentDidMount () {
    this.props.getAttributes();
  }

  render() {
    const { attributes } = this.props.storyViewStore;
    return (
      <Fragment>
        <div className={classes.tableContainer}>
          <AttributesTableCmp
            attributes={attributes}
            onSelectAttribute={this.onSelectAttribute}
            onDeleteAttribute={this.onDeleteAttribute}
          />
        </div>
        <Snackbar innerRef={this.snackbarRef}/>
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

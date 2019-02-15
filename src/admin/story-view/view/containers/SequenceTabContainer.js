import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { StoryModel } from '../../../../infrastructure/models/StoryModel';
import Snackbar from '../../../../shared/components/snackbar/Snackbar';
import { inject, observer } from 'mobx-react';
import SequenceTableCmp from '../components/sequences/sequence-table/SequenceTableCmp';
import { storyViewStorePropTypes } from '../../stores/StoryViewStore';
import { sequenceService } from '../../../../infrastructure/services/SequenceService';
import { withSnackbar } from '../../../../shared/components/form/helpers';
import { optionService } from '../../../../infrastructure/services/OptionService';

@inject('storyViewStore')
@observer
class SequenceTabContainer extends Component {
  state = {
    // snackbar
    open: false,
    variant: 'success',
    message: '',
  };

  onChangeState = (metadata) => {
    return () => this.setState(metadata);
  };

  onDeleteSequence = async sequenceId => {
    const params = { ':story': this.props.story._id };
    sequenceService.setNextRouteParams(params);
    await withSnackbar.call(
      this,
      sequenceService.delete,
      [sequenceId],
      'Sequence deleted'
    );
    this.props.storyViewStore.removeSequence(sequenceId);
  };

  onDeleteOption = async (sequenceId, optionId) => {
    const params = { ':sequence': sequenceId };
    optionService.setNextRouteParams(params);
    await withSnackbar.call(
      this,
      optionService.delete,
      [optionId],
      'Option deleted'
    );
    this.props.storyViewStore.removeSequence(sequenceId);
  };

  getSequences = async () => {
    const params = { ':story': this.props.story._id };
    sequenceService.setNextRouteParams(params);
    const sequences = await sequenceService.list();
    this.props.storyViewStore.setSequences(sequences);
  };

  componentDidMount () {
    this.getSequences();
  }

  render() {
    const { sequences } = this.props.storyViewStore;

    return (
      <Fragment>
        <SequenceTableCmp
          sequences={sequences}
          onDeleteSequence={this.onDeleteSequence}
          onDeleteOption={this.onDeleteOption}
        />
        <Snackbar
          open={this.state.open}
          onClose={this.onChangeState({ open: false })}
          message={this.state.message}
          variant={this.state.variant}
        />
      </Fragment>
    );
  }
}

SequenceTabContainer.propTypes = {
  story: PropTypes.shape(StoryModel),

  storyViewStore: storyViewStorePropTypes,
};

export default SequenceTabContainer;

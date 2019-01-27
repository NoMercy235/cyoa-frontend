import React, { Component, Fragment } from 'react';
import * as PropTypes from 'prop-types';
import { StoryModel } from '../../../stories/domain/models/StoryModel';
import Snackbar from '../../../../shared/components/snackbar/Snackbar';
import { inject, observer } from 'mobx-react';
import SequenceTableCmp from '../components/tables/SequenceTableCmp';
import { storyViewStorePropTypes } from '../../domain/stores/StoryViewStore';
import { sequenceService } from '../../domain/services/SequenceService';

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

  onDeleteSequence = id => {
    console.log('Deleteing: ', id);
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
        {!!sequences.length && <SequenceTableCmp
          sequences={sequences}
          onDeleteSequence={this.onDeleteSequence}
        />}
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

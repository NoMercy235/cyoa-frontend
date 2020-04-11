import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Graph } from 'react-d3-graph';
import { toJS } from 'mobx';

import { Card, CardContent } from '@material-ui/core';
import {
  getOptionsBetweenNodes,
  getOptionsForSequence,
  newGraphOption,
  optionToLink,
  reduceOptionsToUniqueArray,
  seqToNode,
  sourceDestInitialValues
} from '../../../../../../shared/utils/graphUtils';
import { SequenceModel } from '../../../../../../infrastructure/models/SequenceModel';
import { OptionModel } from '../../../../../../infrastructure/models/OptionModel';
import { StoryModel } from '../../../../../../infrastructure/models/StoryModel';
import {
  GRAPH_DEFAULT_CONFIG,
  GRAPH_ENABLE_PREVIEW_LOCAL_STORAGE,
  GRAPH_ID,
  GRAPH_PREVIEW_TIMEOUT,
  GRAPH_WAIT_FOR_GRAPH_STATE_CHANGE
} from '../../../../../../shared/constants/graph';
import ActionsToolbarComponent from '../actions-toolbar/ActionsToolbarComponent';
import SaveGraphSequence from '../save-graph-sequence/SaveGraphSequence';
import SaveGraphOptions from '../save-graph-options/SaveGraphOptions';
import { AttributeModel } from '../../../../../../infrastructure/models/AttributeModel';
import NodePreview from '../node-preview/NodePreview';
import { LocalStorageManager } from '../../../../../../shared/utils/localStorageUtils';

import styles from './WriteStoryComponent.module.scss';

const ViewStates = {
  View: 'VIEW',
  SaveSequence: 'SAVE_SEQUENCE',
  SaveOptions: 'SAVE_OPTIONS',
  PreviewSequence: 'PREVIEW_SEQUENCE',
};

const isPreviewEnabled = LocalStorageManager.getBoolean(GRAPH_ENABLE_PREVIEW_LOCAL_STORAGE);

class WriteStoryComponent extends Component {
  state = {
    viewState: ViewStates.View,
    isPreviewEnabled: isPreviewEnabled,

    // These are used for the save drawers
    sequence: undefined,
    sourceDest: sourceDestInitialValues,
    options: [],

    graphState: { staticGraph: true },
    selectedNode: '',
  };
  graphRef = React.createRef();
  previewTimeout;

  componentDidMount () {
    /**
     * When using { staticGraphWithDragAndDrop: true }, the nodes get slightly rearranged
     * if they are too tight. In order to avoid this, we're initially setting the graph to
     * { staticGraph: true } so everything gets placed where it is supposed to stay
     * and then we change the graph to { staticGraphWithDragAndDrop: true } to allow the
     * user to move the nodes
     */
    setTimeout(() => {
      this.setState({ graphState: { staticGraphWithDragAndDrop: true } });
    }, GRAPH_WAIT_FOR_GRAPH_STATE_CHANGE);
    window.addEventListener('mousedown', this.cancelPreviewTimeout, true);
  }

  componentWillUnmount () {
    window.removeEventListener('mousedown', this.cancelPreviewTimeout, true);
  }

  getSequence = (sequenceId) => {
    const { sequences } = this.props;
    const result = sequences.find(({ _id }) => _id === sequenceId);
    return new SequenceModel(toJS(result));
  };

  onOpenSaveSeqModal = async (sequenceId) => {
    this.cancelPreviewTimeout();
    this.setState({
      viewState: ViewStates.SaveSequence,
      sequence: sequenceId ? this.getSequence(sequenceId) : undefined,
      selectedNode: '',
    })
  };

  onPreviewEnabledChange = (e, value) => {
    this.setState({ isPreviewEnabled: value });
    LocalStorageManager.setItem(GRAPH_ENABLE_PREVIEW_LOCAL_STORAGE, value);
  };

  cancelPreviewTimeout = () => {
    this.previewTimeout && clearTimeout(this.previewTimeout);
  };

  onOpenSeqPreviewModal = async (sequenceId) => {
    this.previewTimeout = setTimeout(() => {
      this.setState({
        viewState: ViewStates.PreviewSequence,
        sequence: this.getSequence(sequenceId),
        selectedNode: '',
      });
    }, GRAPH_PREVIEW_TIMEOUT);
  };

  onDoubleClickNode = (seqId) => {
    const { sequences } = this.props;
    this.cancelPreviewTimeout();

    const sequence = sequences.find(({ _id }) => _id === seqId);
    if (sequence.isEnding) return;

    const { selectedNode } = this.state;

    if (!selectedNode) {
      this.setState({ selectedNode: seqId });
      return;
    }

    this.onOpenSaveOptionsModal(selectedNode, seqId);
  };

  onOpenDeleteSeqModal = (e, seqId) => {
    const { sequences, onDeleteSequenceModalOpen } = this.props;
    this.cancelPreviewTimeout();
    e.preventDefault();
    if (sequences.length === 1) {
      return;
    }
    onDeleteSequenceModalOpen(seqId);
  };

  onOpenDeleteOptionsModal = (e, fromSeqId, toSeqId) => {
    const { onOpenDeleteOptionsModal } = this.props;
    const { options } = this.props;
    e.preventDefault();
    onOpenDeleteOptionsModal(
      fromSeqId,
      toSeqId,
      getOptionsBetweenNodes(fromSeqId, toSeqId, options),
    );
  };

  onOpenSaveOptionsModal = async (fromSeqId, toSeqId) => {
    const { story } = this.props;
    let sourceDest = sourceDestInitialValues;
    let optionsToLoad = [newGraphOption(story)];

    if (fromSeqId && toSeqId) {
      const { options } = this.props;
      const fromSeq = this.getSequence(fromSeqId);
      const toSeq = this.getSequence(toSeqId);
      sourceDest = {
        sequence: {
          value: fromSeqId,
          label: fromSeq.name,
        },
        nextSeq: {
          value: toSeqId,
          label: toSeq.name
        }
      };
      optionsToLoad = getOptionsBetweenNodes(fromSeqId, toSeqId, options);
    }

    this.setState({
      viewState: ViewStates.SaveOptions,
      sourceDest,
      options: optionsToLoad,
      selectedNode: '',
    })
  };

  onSaveOptions = (newOptions) => {
    const { onSaveOptions } = this.props;
    const {
      options: initialOptions,
    } = this.state;
    const optionsToDelete = initialOptions.filter(opt => {
      return !newOptions.find(newOption => newOption._id === opt._id);
    });

    onSaveOptions(newOptions, optionsToDelete);
  };

  onHandleDrawerClose = () => {
    this.cancelPreviewTimeout();
    this.setState({
      sequence: undefined,
      sourceDest: sourceDestInitialValues,
      options: [],
      viewState: ViewStates.View,
      selectedNode: '',
    })
  };

  render () {
    const {
      story,
      sequences,
      options: optionsFromContainer,
      attributes,
      onSaveSequence,
      onUpdateSeqPosition,
    } = this.props;
    const {
      viewState,
      sequence,
      sourceDest,
      options,
      graphState,
      selectedNode,
      isPreviewEnabled,
    } = this.state;

    const data = {
      nodes: sequences.map(seqToNode(story, selectedNode)),
      links: optionsFromContainer
        .reduce(reduceOptionsToUniqueArray, [])
        .map(optionToLink),
    };

    console.log(data);

    return (
      <>
        <div className={styles.writeStoryContainer}>
          <ActionsToolbarComponent
            isPreviewEnabled={isPreviewEnabled}
            onPreviewEnabledChange={this.onPreviewEnabledChange}
            onAddNewSequenceModalOpen={this.onOpenSaveSeqModal}
            onAddNewOptionModalOpen={this.onOpenSaveOptionsModal}
          />
          {!!data.nodes.length && (
            <Card className={styles.writeStoryCard}>
              <CardContent>
                <Graph
                  id={GRAPH_ID}
                  ref={this.graphRef}
                  data={data}
                  config={{
                    ...GRAPH_DEFAULT_CONFIG,
                    ...graphState,
                  }}
                  {...(!story.published && {
                    onClickNode: this.onOpenSaveSeqModal,
                    onDoubleClickNode: this.onDoubleClickNode,
                    onRightClickNode: this.onOpenDeleteSeqModal,
                    onClickLink: this.onOpenSaveOptionsModal,
                    onRightClickLink: this.onOpenDeleteOptionsModal,
                  })}
                  onNodePositionChange={onUpdateSeqPosition}
                  {...(isPreviewEnabled) && {
                    onMouseOverNode: this.onOpenSeqPreviewModal,
                    onMouseOutNode: this.cancelPreviewTimeout,
                  }}
                />
              </CardContent>
            </Card>
          )}
        </div>
        <SaveGraphSequence
          open={viewState === ViewStates.SaveSequence}
          story={story}
          sequence={sequence}
          onSuccess={onSaveSequence}
          onDrawerClose={this.onHandleDrawerClose}
        />
        <SaveGraphOptions
          open={viewState === ViewStates.SaveOptions}
          story={story}
          sourceDest={sourceDest}
          options={options}
          attributes={attributes}
          onSubmitAll={this.onSaveOptions}
          onDrawerClose={this.onHandleDrawerClose}
        />
        <NodePreview
          open={viewState === ViewStates.PreviewSequence}
          story={story}
          sequences={sequences}
          {...(sequence && {
            sequence,
            options: getOptionsForSequence(sequence._id, optionsFromContainer),
          })}
          onDrawerClose={this.onHandleDrawerClose}
        />
      </>
    );
  }
}

WriteStoryComponent.propTypes = {
  story: PropTypes.instanceOf(StoryModel).isRequired,
  sequences: PropTypes.arrayOf(PropTypes.instanceOf(SequenceModel)).isRequired,
  options: PropTypes.arrayOf(PropTypes.instanceOf(OptionModel)).isRequired,
  attributes: PropTypes.arrayOf(PropTypes.instanceOf(AttributeModel)).isRequired,

  onSaveSequence: PropTypes.func.isRequired,
  onDeleteSequenceModalOpen: PropTypes.func.isRequired,
  onOpenDeleteOptionsModal: PropTypes.func.isRequired,
  onSaveOptions: PropTypes.func.isRequired,
  onUpdateSeqPosition: PropTypes.func.isRequired,
};

export default WriteStoryComponent;

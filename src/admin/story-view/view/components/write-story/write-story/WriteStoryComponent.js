import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Graph } from 'react-d3-graph';
import { toJS } from 'mobx';

import { Card, CardContent } from '@material-ui/core';
import {
  getOptionsBetweenNodes,
  optionToLink,
  seqToNode,
  sourceDestInitialValues
} from '../../../../../../shared/utils/graphUtils';
import { SequenceModel } from '../../../../../../infrastructure/models/SequenceModel';
import { OptionModel } from '../../../../../../infrastructure/models/OptionModel';
import { StoryModel } from '../../../../../../infrastructure/models/StoryModel';
import { GRAPH_ID, GRAPH_WAIT_FOR_GRAPH_STATE_CHANGE } from '../../../../../../shared/constants/graph';
import ActionsToolbarComponent from '../actions-toolbar/ActionsToolbarComponent';
import SaveGraphSequence from '../save-graph-sequence/SaveGraphSequence';
import SaveGraphOptions from '../save-graph-options/SaveGraphOptions';
import { AttributeModel } from '../../../../../../infrastructure/models/AttributeModel';

import styles from './WriteStoryComponent.module.scss';

const ViewStates = {
  View: 'VIEW',
  SaveSequence: 'SAVE_SEQUENCE',
  SaveOptions: 'SAVE_OPTIONS',
};

class WriteStoryComponent extends Component {
  state = {
    viewState: ViewStates.View,

    // These are used for the save drawers
    sequence: undefined,
    sourceDest: sourceDestInitialValues,
    options: [],

    graphState: { staticGraph: true },
  };
  graphRef = React.createRef();

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
  }

  getSequence = (sequenceId) => {
    const { sequences } = this.props;
    const result = sequences.find(({ _id }) => _id === sequenceId);
    return new SequenceModel(toJS(result));
  };

  onOpenSaveSeqModal = async (sequenceId) => {
    this.setState({
      viewState: ViewStates.SaveSequence,
      sequence: sequenceId ? this.getSequence(sequenceId) : undefined,
    })
  };

  onOpenDeleteSeqModal = (e, seqId) => {
    const { sequences, onDeleteSequenceModalOpen } = this.props;
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
    let optionsToLoad = [new OptionModel({
      action: 'New option',
      story: story._id,
    })];

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
    this.setState({
      sequence: undefined,
      sourceDest: sourceDestInitialValues,
      options: [],
      viewState: ViewStates.View,
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
    } = this.state;

    const data = {
      nodes: sequences.map(seqToNode(story)),
      links: optionsFromContainer
        .reduce((curr, option) => {
          // Display only one link from a sequence to another
          // even if there are multiple options
          const linkBetweenNodesExists = curr.find(o => {
            return o.sequence === option.sequence && o.nextSeq === option.nextSeq;
          });
          if (linkBetweenNodesExists) {
            return curr;
          }
          return [...curr, option];
        }, [])
        .map(optionToLink),
    };

    console.log(data);

    return (
      <>
        <div className={styles.writeStoryContainer}>
          <ActionsToolbarComponent
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
                    directed: true,
                    nodeHighlightBehavior: true,
                    ...graphState,
                    node: {
                      labelProperty: 'name',
                      fontSize: 16,
                      highlightFontSize: 20,
                      highlightFontWeight: 'bold',
                      highlightColor: 'aqua',
                    },
                    link: {
                      fontSize: 16,
                      highlightFontSize: 20,
                      highlightFontWeight: 'bold',
                      highlightColor: 'lightblue',
                      strokeWidth: 3,
                    },
                  }}
                  onClickNode={this.onOpenSaveSeqModal}
                  onRightClickNode={this.onOpenDeleteSeqModal}
                  onClickLink={this.onOpenSaveOptionsModal}
                  onRightClickLink={this.onOpenDeleteOptionsModal}
                  onNodePositionChange={onUpdateSeqPosition}
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
      </>
    );
  }
}

WriteStoryComponent.propTypes = {
  story: PropTypes.instanceOf(StoryModel),
  sequences: PropTypes.arrayOf(PropTypes.instanceOf(SequenceModel)),
  options: PropTypes.arrayOf(PropTypes.instanceOf(OptionModel)),
  attributes: PropTypes.arrayOf(PropTypes.instanceOf(AttributeModel)),

  onSaveSequence: PropTypes.func.isRequired,
  onDeleteSequenceModalOpen: PropTypes.func.isRequired,
  onOpenDeleteOptionsModal: PropTypes.func.isRequired,
  onSaveOptions: PropTypes.func.isRequired,
  onUpdateSeqPosition: PropTypes.func.isRequired,
};

export default WriteStoryComponent;

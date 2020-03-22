import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Graph } from 'react-d3-graph';
import { toJS } from 'mobx';

import { Card, CardContent } from '@material-ui/core';
import {
  getNewGraph,
  optionToLink,
  seqToNode,
  sourceDestInitialValues
} from '../../../../../../shared/utils/graphUtils';
import { SequenceModel } from '../../../../../../infrastructure/models/SequenceModel';
import { OptionModel } from '../../../../../../infrastructure/models/OptionModel';
import { StoryModel } from '../../../../../../infrastructure/models/StoryModel';
import { GRAPH_ID } from '../../../../../../shared/constants/graph';
import ActionsToolbarComponent from '../actions-toolbar/ActionsToolbarComponent';
import SaveGraphSequence from '../save-graph-sequence/SaveGraphSequence';
import SaveGraphOptions from '../save-graph-options/SaveGraphOptions';

import styles from './WriteStoryComponent.module.scss';

const ViewStates = {
  View: 'VIEW',
  SaveSequence: 'SAVE_SEQUENCE',
  SaveOptions: 'SAVE_OPTIONS',
};

class WriteStoryComponent extends Component {
  state = {
    viewState: ViewStates.View,
    sequence: undefined,
    sourceDest: sourceDestInitialValues,
    options: [],
    nodes: this.props.sequences,
    links: this.props.options,
  };
  graphRef = React.createRef();

  onSaveStory = () => {
    console.log(getNewGraph(this.graphRef));
  };

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

  onOpenSaveOptionsModal = async (fromSeqId, toSeqId) => {
    let sourceDest = sourceDestInitialValues;
    if (fromSeqId && toSeqId) {
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
      }
    }

    this.setState({
      viewState: ViewStates.SaveOptions,
      sourceDest,
      options: [new OptionModel({
        action: 'New action'
      })],
    })
  };

  addOption = () => {
    const { options } = this.state;
    const newOptions = [...options, new OptionModel({ action: 'New Option' })];
    this.setState({ options: newOptions });
  };

  replaceOptionInArray = (index, newOption) => {
    const { options } = this.state;
    const newOptions = options.map((option, i) => {
      return i === index ? newOption : option;
    });
    this.setState({ options: newOptions });
  };

  removeOptionInArray = (index) => {
    const { options } = this.state;
    const newOptions = options.filter((option, i) => i !== index);
    this.setState({ options: newOptions });
  };

  onHandleDrawerClose = () => {
    this.setState({
      sequence: undefined,
      options: [],
      viewState: ViewStates.View
    })
  };

  render () {
    const {
      story,
      onSaveSequence,
      onSaveOptions,
      onUpdateSeqPosition,
    } = this.props;
    const {
      viewState,
      sequence,
      sourceDest,
      options,
      nodes,
      links,
    } = this.state;

    const data = {
      nodes: nodes.map(seqToNode(story)),
      links: links
        .reduce((curr, option) => {
          // Display only one link from a sequence to another
          // even if there are multiple options
          if (curr.find(o => o.sequence === option.sequence)) {
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
            onSaveStory={this.onSaveStory}
          />
          <Card className={styles.writeStoryCard}>
            <CardContent>
              <Graph
                id={GRAPH_ID}
                ref={this.graphRef}
                data={data}
                config={{
                  directed: true,
                  nodeHighlightBehavior: true,
                  staticGraphWithDragAndDrop: true,
                  node: {
                    labelProperty: 'name',
                    fontSize: 16,
                    highlightFontSize: 20,
                    highlightFontWeight: 'bold',
                    highlightColor: 'aqua',
                  },
                  link: {
                    // renderLabel: true,
                    // labelProperty: 'action',
                    fontSize: 16,
                    highlightFontSize: 20,
                    highlightFontWeight: 'bold',
                    highlightColor: 'lightblue',
                    strokeWidth: 3,
                  },
                }}
                onClickNode={this.onOpenSaveSeqModal}
                onClickLink={this.onOpenSaveOptionsModal}
                onNodePositionChange={onUpdateSeqPosition}
              />
            </CardContent>
          </Card>
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
          attributes={[]}
          addOption={this.addOption}
          replaceOptionInArray={this.replaceOptionInArray}
          removeOptionInArray={this.removeOptionInArray}
          onSubmitAll={onSaveOptions}
          onDrawerClose={this.onHandleDrawerClose}
        />
      </>
    );
  }
}

WriteStoryComponent.propTypes = {
  story: PropTypes.instanceOf(StoryModel),
  sequences: PropTypes.arrayOf(PropTypes.shape(SequenceModel)),
  options: PropTypes.arrayOf(PropTypes.shape(OptionModel)),

  onSaveSequence: PropTypes.func.isRequired,
  onSaveOptions: PropTypes.func.isRequired,
  onUpdateSeqPosition: PropTypes.func.isRequired,
};

export default WriteStoryComponent;

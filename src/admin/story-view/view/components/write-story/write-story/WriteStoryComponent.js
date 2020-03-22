import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Graph } from 'react-d3-graph';
import { toJS } from 'mobx';

import { Card, CardContent } from '@material-ui/core';
import {
  getNewGraph,
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

  addOption = () => {
    const { story } = this.props;
    const { options } = this.state;
    const newOption = new OptionModel({
      action: 'New Option',
      story: story._id,
    });
    const newOptions = [...options, newOption];
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
      sourceDest: sourceDestInitialValues,
      options: [],
      viewState: ViewStates.View
    })
  };

  render () {
    const {
      story,
      sequences,
      options: optionFromContainer,
      attributes,
      onSaveSequence,
      onSaveOptions,
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
      links: optionFromContainer
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
                  ...graphState,
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
          attributes={attributes}
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
  sequences: PropTypes.arrayOf(PropTypes.instanceOf(SequenceModel)),
  options: PropTypes.arrayOf(PropTypes.instanceOf(OptionModel)),
  attributes: PropTypes.arrayOf(PropTypes.instanceOf(AttributeModel)),

  onSaveSequence: PropTypes.func.isRequired,
  onSaveOptions: PropTypes.func.isRequired,
  onUpdateSeqPosition: PropTypes.func.isRequired,
};

export default WriteStoryComponent;

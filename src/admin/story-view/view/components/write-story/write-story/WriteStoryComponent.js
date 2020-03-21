import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Graph } from 'react-d3-graph';
import { toJS } from 'mobx';

import { Card, CardContent } from '@material-ui/core';
import {
  getNewGraph,
  optionToLink,
  seqToNode
} from '../../../../../../shared/utils/graphUtils';
import { SequenceModel } from '../../../../../../infrastructure/models/SequenceModel';
import { OptionModel } from '../../../../../../infrastructure/models/OptionModel';
import { StoryModel } from '../../../../../../infrastructure/models/StoryModel';
import { GRAPH_ID } from '../../../../../../shared/constants/graph';

import styles from './WriteStoryComponent.module.scss';
import ActionsToolbarComponent from '../actions-toolbar/ActionsToolbarComponent';
import SaveGraphSequence from '../save-graph-sequence/SaveGraphSequence';

const ViewStates = {
  View: 'VIEW',
  SaveSequence: 'SAVE_SEQUENCE',
  SaveOptions: 'SAVE_OPTIONS',
};

class WriteStoryComponent extends Component {
  state = {
    viewState: ViewStates.View,
    resource: undefined,
    nodes: this.props.sequences,
    links: this.props.options,
  };
  graphRef = React.createRef();

  onSaveStory = () => {
    console.log(getNewGraph(this.graphRef));
  };

  getSequence = async (sequenceId) => {
    const { sequences } = this.props;
    const result = sequences.find(({ _id }) => _id === sequenceId);
    return new SequenceModel(toJS(result));
  };

  onOpenSaveSeqModal = async (sequenceId) => {
    let resource;
    if (sequenceId) {
      resource = await this.getSequence(sequenceId);
    }

    this.setState({
      viewState: ViewStates.SaveSequence,
      resource,
    })
  };

  onHandleDrawerClose = () => {
    this.setState({
      viewState: ViewStates.View
    })
  };

  render () {
    const {
      story,
      onSaveSequence,
      onEditOption,
      onUpdateSeqPosition,
    } = this.props;
    const { viewState, resource, nodes, links } = this.state;
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
                onClickLink={onEditOption}
                onNodePositionChange={onUpdateSeqPosition}
              />
            </CardContent>
          </Card>
        </div>
        <SaveGraphSequence
          open={viewState === ViewStates.SaveSequence}
          story={story}
          sequence={resource}
          onSuccess={onSaveSequence}
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
  onEditOption: PropTypes.func.isRequired,
  onUpdateSeqPosition: PropTypes.func.isRequired,
};

export default WriteStoryComponent;

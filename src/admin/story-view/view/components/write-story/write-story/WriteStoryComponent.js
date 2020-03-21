import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Graph } from 'react-d3-graph';

import { Button } from '@material-ui/core';
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

class WriteStoryComponent extends Component {
  state = {
    nodes: this.props.sequences,
    links: this.props.options,
  };
  graphRef = React.createRef();

  saveGraph = () => {
    console.log(getNewGraph(this.graphRef));
  };

  onOpenSaveSeqModal = () => {
    // TODO: open modal
  };

  render () {
    const {
      story,
      onEditSequence,
      onEditOption,
    } = this.props;
    const { nodes, links } = this.state;
    const data = {
      nodes: nodes.map(seqToNode(story)),
      links: links
        .reduce((curr, option) => {
          if (curr.find(o => o.sequence === option.sequence)) {
            return curr;
          }
          return [...curr, option];
        }, [])
        .map(optionToLink),
    };

    console.log(data);

    return (
      <div className={styles.writeStoryContainer}>
        <div>
          <Button
            onClick={this.onOpenSaveSeqModal}
          >
            New
          </Button>
        </div>
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
          onClickNode={onEditSequence}
          onClickLink={onEditOption}
        />
      </div>
    );
  }
}

WriteStoryComponent.propTypes = {
  story: PropTypes.instanceOf(StoryModel),
  sequences: PropTypes.arrayOf(PropTypes.shape(SequenceModel)),
  options: PropTypes.arrayOf(PropTypes.shape(OptionModel)),

  onEditSequence: PropTypes.func.isRequired,
  onEditOption: PropTypes.func.isRequired,
};

export default WriteStoryComponent;

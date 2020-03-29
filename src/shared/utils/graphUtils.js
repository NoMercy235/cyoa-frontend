import { ThemeColors } from '../utilities';
import { GRAPH_NODE_SIZE, GraphLinkTypes, GraphNodeLabelPositions } from '../constants/graph';
import { OptionModel } from '../../infrastructure/models/OptionModel';

export const NodeSymbol = {
  Circle: 'circle',
  Triangle: 'triangle',
  Square: 'square',
  Diamond: 'Diamond',
  Wye: 'Wye',
};

const randomNumberInRange = (min, max) => {
  return Math.floor(Math.random()*(max - min) + min);
};

export const generateRandomPosition = () => {
  return {
    x: randomNumberInRange(100, window.innerWidth/(4/3)),
    y: randomNumberInRange(window.innerHeight/3, window.innerHeight/2),
  };
};

export const seqToNode = (story, selectedNode) => seq => {
  const position = seq.x && seq.y
    ? { x: seq.x, y: seq.y }
    : generateRandomPosition();

  return {
    id: seq._id,
    ...position,
    size: GRAPH_NODE_SIZE,
    name: seq.name,
    ...(story.startSeq === seq._id && {
      symbolType: NodeSymbol.Wye,
      color: ThemeColors.Primary,
    }),
    ...(seq.isEnding && {
      symbolType: NodeSymbol.Triangle,
      color: ThemeColors.Secondary,
    }),
    ...(selectedNode === seq._id && { strokeColor: ThemeColors.Secondary }),
    labelPosition: GraphNodeLabelPositions.Top,
  }
};

export const reduceOptionsToUniqueArray = (curr, option) => {
  // Display only one link from a sequence to another
  // even if there are multiple options
  const linkBetweenNodesExists = curr.find(o => {
    return o.sequence === option.sequence && o.nextSeq === option.nextSeq;
  });
  if (linkBetweenNodesExists) {
    return curr;
  }
  return [...curr, option];
};

export const optionToLink = (option, index, options) => {
  const hasTwoWay = options
    .find(otherOption => {
      return otherOption.sequence === option.nextSeq
        && otherOption.nextSeq === option.sequence;
    });

  return {
    source: option.sequence,
    target: option.nextSeq,
    ...(!!hasTwoWay && { type: GraphLinkTypes.CurveSmooth }),
  }
};

export const sourceDestInitialValues = {
  sequence: undefined,
  nextSeq: undefined,
};

export const getOptionsBetweenNodes = (fromSeqId, toSeqId, options) => {
  return options.filter(({ sequence, nextSeq }) => {
    return sequence === fromSeqId && nextSeq === toSeqId;
  });
};

export const newGraphOption = (story) => {
  return new OptionModel({
    action: 'New option',
    story: story._id,
  })
};

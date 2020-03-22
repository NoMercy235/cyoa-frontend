import { ThemeColors } from '../utilities';
import { GRAPH_NODE_SIZE } from '../constants/graph';

export const NodeSymbol = {
  Circle: 'circle',
  Triangle: 'triangle',
  Square: 'square',
  Diamond: 'Diamond',
  Wye: 'Wye',
};

export const generateRandomPosition = () => {
  return {
    x: Math.floor(Math.random() * 800),
    y: Math.floor(Math.random() * 800),
  };
};

export const seqToNode = story => seq => {
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
  }
};

export const optionToLink = option => {
  return {
    source: option.sequence,
    target: option.nextSeq,
    action: option.action,
  }
};

export const getNewGraph = (graphRef) => {
  const {
    current: {
      state: {
        nodes,
        links
      }
    }
  } = graphRef;
  return {
    nodes: Object.values(nodes).map(node => {
      return { id: node.id, x: node.x, y: node.y };
    }),
    links: Object.entries(links).map(([source, targets]) => {
      return Object.keys(targets).map(target => {
        return {
          source,
          target,
        };
      });
    }).flat()
  };
};

export const sourceDestInitialValues = {
  sequence: undefined,
  nextSeq: undefined,
};

export const GRAPH_ID = 'write-story-graph';
export const GRAPH_NODE_SIZE = 500;
export const GRAPH_SOURCE_DEST_PROPERTY = 'sourceDest';

export const GRAPH_WAIT_FOR_GRAPH_STATE_CHANGE = 1000;

export const GraphLinkTypes = {
  Straight: 'STRAIGHT',
  CurveSmooth: 'CURVE_SMOOTH',
  CurveFull: 'CURVE_FULL',
};

export const GraphNodeLabelPositions = {
  Top: 'top',
  Right: 'right',
  Bottom: 'bottom',
  Left: 'left',
  Center: 'center',
};

export const NEW_SEQUENCE_POSITION = {
  x: 30,
  y: 50,
};

const NODE_LINK_CONFIG = {
  fontSize: 16,
  highlightFontSize: 20,
  highlightFontWeight: 'bold',
};

export const GRAPH_DEFAULT_CONFIG = {
  directed: true,
  nodeHighlightBehavior: true,
  node: {
    labelProperty: 'name',
    ...NODE_LINK_CONFIG,
    highlightColor: 'aqua',
  },
  link: {
    ...NODE_LINK_CONFIG,
    highlightColor: 'lightblue',
    strokeWidth: 3,
  },
};

export const GRAPH_ENABLE_PREVIEW_LOCAL_STORAGE = 'isPreviewEnabled';

export const GRAPH_PREVIEW_TIMEOUT = 1000;

export const ERRORS = {
  fieldRequired: 'This field is required',
  fileTooLarge: 'The file is too large',

  cannotPerformActionWhileStoryPublished: 'Cannot perform action while story is published',
};

export const BACKEND_ERRORS = {
  noStartSeq: 'The story has no associated start sequence',
  noEndSeq: 'The story has no associated ending. You need at least one ending sequence',
  noRouteToEndSeq: 'There is no route between the start sequence and at least one of the endings',
};

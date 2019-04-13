import React, { Fragment } from 'react';
import HelpCmp from '../../../../../shared/components/help/HelpCmp';

function getTitle() {
  return 'The story\'s attributes';
}

function getDescription () {
  return (
    <Fragment>
      <p>Define attributes which will be attached to a player when starting your story</p>
      <p>You have full control over the behavior of attributes. If you want to end a story when an attribute goes below 0, then you will handle that case from the sequence options</p>
    </Fragment>
  );
}

export function renderAttributesTableTitle () {
  return (
    <HelpCmp text="Attributes" title={getTitle()} description={getDescription()}/>
  );
}

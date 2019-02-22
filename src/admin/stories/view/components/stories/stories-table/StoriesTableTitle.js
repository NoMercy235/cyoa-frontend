import React, { Fragment } from 'react';
import HelpCmp from '../../../../../../shared/components/help/HelpCmp';

function getTitle() {
  return 'Create stories';
}

function getDescription () {
  return (
    <Fragment>
      <p>Stories may or may not be part of a collection.</p>
      <p>You can access a story either by clicking on its name or on the view icon. From there on, you may edit multiple elements regarding the functionality of the story.</p>
    </Fragment>
  );
}

export function renderStoriesTableTitle () {
  return (
    <HelpCmp text="Stories" title={getTitle()} description={getDescription()}/>
  );
}

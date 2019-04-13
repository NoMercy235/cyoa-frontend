import React, { Fragment } from 'react';
import HelpCmp from '../../../../../../shared/components/help/HelpCmp';

function getTitle() {
  return 'Create chapters for your story';
}

function getDescription () {
  return (
    <Fragment>
      <p>You can group your sequences into chapters to manage them more easily.</p>
      <p>A chapter can have any number of sub chapters, but the depth of sub chapters cannot go beyond 2.</p>
    </Fragment>
  );
}

export function renderChaptersListTitle () {
  return (
    <HelpCmp text="Chapters" title={getTitle()} description={getDescription()}/>
  );
}

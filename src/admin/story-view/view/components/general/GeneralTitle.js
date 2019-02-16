import React, { Fragment } from 'react';
import HelpCmp from '../../../../../shared/components/help/HelpCmp';

function getTitle() {
  return 'Story general tab';
}

function getDescription () {
  return (
    <Fragment>
      <span>What you will find:</span>
      <ul>
        <li>The short and long descriptions of your story and its image</li>
        <li>The (un)publish buttons which make your story available for the public</li>
      </ul>
    </Fragment>
  );
}

export function renderGeneralTitle (story) {
  return (
    <HelpCmp
      text={story.name}
      textSize="h4"
      title={getTitle()}
      description={getDescription()}
    />
  );
}

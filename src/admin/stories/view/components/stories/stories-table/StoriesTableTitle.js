import React from 'react';

import HelpCmp from '../../../../../../shared/components/help/HelpCmp';

function getTitle() {
  return 'Create stories';
}

function getDescription () {
  return (
    <>
      <p>Stories may or may not be part of a collection.</p>
      <p>You can access a story either by clicking on its name or on the view icon. From there on, you may edit multiple elements regarding the functionality of the story.</p>
      <p>A story that is available offline will allow a user to download that story on their device and read it while not being connected to the internet. As a consequence, you will noy be able to add player attributes to that particular story and its actions will not have any consequences (since there are no attributes to modify).</p>
    </>
  );
}

export function renderStoriesTableTitle () {
  return (
    <HelpCmp text="Stories" title={getTitle()} description={getDescription()}/>
  );
}

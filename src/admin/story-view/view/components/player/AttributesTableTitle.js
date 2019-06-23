import React from 'react';

import HelpCmp from '../../../../../shared/components/help/HelpCmp';

function getTitle() {
  return 'The story\'s attributes';
}

function getDescription () {
  return (
    <>
      <p>Define attributes which will be attached to a player when starting your story</p>
      <p>An important attribute must be linked to a specific ending sequence. When the value of that attribute will reach 0 or lower, the player will lose and will be shown the linked ending sequence.</p>
      <p>Warning! Deleting an attribute will automatically remove all related consequences from the options.</p>
    </>
  );
}

export function renderAttributesTableTitle () {
  return (
    <HelpCmp text="Attributes" title={getTitle()} description={getDescription()}/>
  );
}

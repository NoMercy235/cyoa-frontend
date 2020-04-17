import React from 'react';

import HelpCmp from '../../../../../shared/components/help/HelpCmp';

function getTitle() {
  return 'The story\'s attributes';
}

function getDescription () {
  return (
    <>
      <p>Define attributes which will be attached to a player when starting your story</p>
      <p>Attributes can define things like stats (health, mana, etc), currencies and even items. Then, they can be used as requirements for options that lead to certain parts of the story where a player cannot go unless they have some specific items (or a specific amount of an item)</p>
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

import React, { Fragment } from 'react';
import HelpCmp from '../../../../../shared/components/help/HelpCmp';

function getTitle() {
  return 'The story\'s attributes';
}

function getDescription () {
  return (
    <Fragment>
      <ul>
        <li>Define attributes which will be attached to a player when starting your story</li>
        <li>Important attributes are a way to distinguish between attributes that will affect the story in a matter that cannot be neglected. Example: the <b>health</b> of a player can be important. If it is dropped to 0, nothing happens, but the story should define the ending sequence linked to the state where the player has reached 0 hp.</li>
        <li>Attributes which are <b>not</b> important can drop to 0 (even below that, if the author wishes so). For example, you can define currencies here.</li>
      </ul>
    </Fragment>
  );
}

export function renderAttributesTableTitle () {
  return (
    <HelpCmp text="Attributes" title={getTitle()} description={getDescription()}/>
  );
}

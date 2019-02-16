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
        <li>If an important attribute has its value dropped below 0, the player will lose</li>
      </ul>
    </Fragment>
  );
}

export function renderAttributesTableTitle () {
  return (
    <HelpCmp text="Attributes" title={getTitle()} description={getDescription()}/>
  );
}

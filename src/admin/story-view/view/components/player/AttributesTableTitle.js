import React from 'react';
import { Typography } from '@material-ui/core';

import HelpCmp from '../../../../../shared/components/help/HelpCmp';

function getTitle() {
  return 'Manage the story\'s attributes';
}

function getDescription () {
  return (
    <ul>
      <li>
        <Typography>
          Define attributes which will be attached to a player when starting your story
        </Typography>
      </li>
      <li>
        <Typography>
          Attributes can define things like stats (health, mana, etc), currencies and even items. Then, they can be used as requirements for options that lead to certain parts of the story where a player cannot go unless they have some specific items (or a specific amount of an item)
        </Typography>
      </li>
      <li>
        <Typography>
          An <b>important</b> attribute must be linked to a specific ending sequence. When the value of that attribute will reach 0 or lower, the player will lose and will be shown the linked ending sequence
        </Typography>
      </li>
      <li>
        <Typography color="secondary">
          <b>Warning!</b> Deleting an attribute will automatically remove all related consequences from the options
        </Typography>
      </li>
    </ul>
  );
}

export function renderAttributesTableTitle () {
  return (
    <HelpCmp text="Attributes" title={getTitle()} description={getDescription()}/>
  );
}

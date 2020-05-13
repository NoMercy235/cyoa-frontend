import React from 'react';
import { Typography } from '@material-ui/core';

import HelpCmp from '../../../../../../shared/components/help/HelpCmp';

function getTitle() {
  return 'Manage collections to group your stories';
}

function getDescription () {
  return (
    <ul>
      <li>
        <Typography>
          The role of collections is simply to group your stories and make it easier to access them
        </Typography>
      </li>
    </ul>
  );
}

export function renderCollectionsTableTitle () {
  return (
    <HelpCmp text="Collections" title={getTitle()} description={getDescription()}/>
  );
}

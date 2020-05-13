import React from 'react';
import { Typography } from '@material-ui/core';

import HelpCmp from '../../../../../../shared/components/help/HelpCmp';

function getTitle() {
  return 'Manage stories';
}

function getDescription () {
  return (
    <ul>
      <li>
        <Typography>
          Stories may or may not be part of a collection
        </Typography>
      </li>
      <li>
        <Typography>
          A story that is available offline will allow a user to download that story on their device and read it while not being connected to the internet. As a consequence, you will noy be able to add player attributes to that particular story and its actions will not have any consequences (since there are no attributes to modify)
        </Typography>
      </li>
    </ul>
  );
}

export function renderStoriesTableTitle () {
  return (
    <HelpCmp text="Stories" title={getTitle()} description={getDescription()}/>
  );
}

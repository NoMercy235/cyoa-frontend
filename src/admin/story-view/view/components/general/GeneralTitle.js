import React from 'react';
import { Typography } from '@material-ui/core';

import HelpCmp from '../../../../../shared/components/help/HelpCmp';

function getTitle() {
  return 'Story details';
}

function getDescription () {
  return (
    <ul>
      <li>
        <Typography>
          Here you will find a summary of the information relevant to your story.
        </Typography>
      </li>
    </ul>
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

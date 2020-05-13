import React from 'react';
import { Typography } from '@material-ui/core';

import HelpCmp from '../../../../../../shared/components/help/HelpCmp';

function getTitle() {
  return 'Create chapters for your story';
}

function getDescription () {
  return (
    <ul>
      <li>
        <Typography>
          You can group your sequences into chapters to manage them more easily
        </Typography>
      </li>
      <li>
        <Typography>
          The name of the chapter will appear when the player reads a sequence belonging to that chapter. If the sequence is not assigned to a chapter, the story name will be shown instead
        </Typography>
      </li>
    </ul>
  );
}

export function renderChaptersListTitle () {
  return (
    <HelpCmp text="Chapters" title={getTitle()} description={getDescription()}/>
  );
}

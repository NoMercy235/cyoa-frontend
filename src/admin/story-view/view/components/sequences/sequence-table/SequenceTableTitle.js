import React from 'react';
import { Typography } from '@material-ui/core';

import HelpCmp from '../../../../../../shared/components/help/HelpCmp';
import { ADMIN_WRITE_STORY_ROUTE, makePath } from '../../../../../../shared/constants/routes';

function getTitle() {
  return 'Create sequences for your story';
}

function getDescription (story) {
  return (
    <>
      <Typography color="secondary">
        Important! You can use the advanced mode of the story writing <a href={makePath(ADMIN_WRITE_STORY_ROUTE, { ':id': story._id })} target="_blank" rel="noopener noreferrer">here</a>
      </Typography>
      <br />
      <Typography>The sequences have the following structure:</Typography>
      <ul>
        <li>
          <Typography>
            <b>chapter</b> - Use this to manage your sequences easier
          </Typography>
        </li>
        <li>
          <Typography>
            <b>name</b> - A note for the author to find the sequence easier. The user will not see it
          </Typography>
        </li>
        <li>
          <Typography>
            <b>isStartSeq</b> - This sequence will be used for the start of the story
          </Typography>
        </li>
        <li>
          <Typography>
            <b>isEnding</b> - The story will end when this sequence is reached. A story may have multiple endings
          </Typography>
        </li>
        <li>
          <Typography>
            <b>content</b> - The part of the story that unfolds in the particular sequence
          </Typography>
        </li>
      </ul>
      <Typography>To define what options each sequence has, use the expand button to the left of the sequence.</Typography>
      <br />
      <Typography>You can reorder the sequences one step at a time if you wish them to appear in a different order in the table. The reordering will only affect your view of the sequences and will not have an impact on the public page where other users can read your story.</Typography>
    </>
  );
}

export function renderSequenceTableTitle (story) {
  return (
    <HelpCmp text="Sequences" title={getTitle()} description={getDescription(story)}/>
  );
}

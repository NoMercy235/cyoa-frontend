import React, { Fragment } from 'react';
import HelpCmp from '../../../../../../shared/components/help/HelpCmp';

function getTitle() {
  return 'Create sequences for your story';
}

function getDescription () {
  return (
    <Fragment>
      <span>The sequences have the following structure:</span>
      <ul>
        <li><b>chapter</b> Use this to manage your sequences easier</li>
        <li><b>name</b> A note for the author to find the sequence easier. The user will not see it</li>
        <li><b>isStartSeq</b> This sequence will be used for the start of the story</li>
        <li><b>isEnding</b> The sequence has no other follow up.</li>
        <li><b>content</b> The part of the story that unfolds in the particular sequence</li>
      </ul>
      <span>To define what options each sequence has, use the expand button to the left of the sequence.</span>
      <p>You can reorder the sequences one step at a time if you wish them to appear in a different order in this table. The reordering will only affect your view of the sequences and will not have an impact on the public page where other users can read your story.</p>
    </Fragment>
  );
}

export function renderSequenceTableTitle () {
  return (
    <HelpCmp text="Sequences" title={getTitle()} description={getDescription()}/>
  );
}

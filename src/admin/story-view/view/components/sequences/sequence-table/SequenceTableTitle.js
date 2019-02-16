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
        <li><b>name</b> Just for identification purposes</li>
        <li><b>isStartSeq</b> This sequence will be used for the start of the story</li>
        <li><b>isEnding</b> The sequence has no other follow up.</li>
        <li><b>content</b> The part of the story that unfolds in the particular sequence</li>
      </ul>
      <span>To define what options each sequence has, use the expand button to the left of the sequence.</span>
    </Fragment>
  );
}

export function renderSequenceTableTitle () {
  return (
    <HelpCmp text="Sequences" title={getTitle()} description={getDescription()}/>
  );
}

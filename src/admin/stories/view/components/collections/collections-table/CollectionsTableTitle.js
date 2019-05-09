import React from 'react';
import HelpCmp from '../../../../../../shared/components/help/HelpCmp';

function getTitle() {
  return 'Create collections to group your stories';
}

function getDescription () {
  return (
    <>
      <span>The role of collections is simply to group your stories and make it easier to access them.</span>
    </>
  );
}

export function renderCollectionsTableTitle () {
  return (
    <HelpCmp text="Collections" title={getTitle()} description={getDescription()}/>
  );
}

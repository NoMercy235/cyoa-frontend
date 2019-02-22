import React, { Fragment } from 'react';
import HelpCmp from '../../../../../../shared/components/help/HelpCmp';

function getTitle() {
  return 'Create collections to group your stories';
}

function getDescription () {
  return (
    <Fragment>
      <span>The role of collections is simply to group your stories and make it easier to access them.</span>
    </Fragment>
  );
}

export function renderCollectionsTableTitle () {
  return (
    <HelpCmp text="Collections" title={getTitle()} description={getDescription()}/>
  );
}

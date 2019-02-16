import React, { Fragment } from 'react';
import HelpCmp from '../../../../../../shared/components/help/HelpCmp';

function getTitle() {
  return 'Define options for your sequence';
}

function getDescription () {
  return (
    <Fragment>
      <p>The options have the following structure:</p>
      <ul>
        <li><b>action</b> The text that will appear to the user when they want to select this option</li>
        <li><b>leadsTo</b> The sequence that will follow after this option is chosen</li>
        <li><b>consequences</b> One or more consequences that will take effect once the option has been chosen</li>
      </ul>
      <span>The consequences have the following structure:</span>
      <ul>
        <li><b>attribute</b> The attribute that they will affect</li>
        <li><b>changeValue</b> The value which dictates how the original value of the attribute will change</li>
      </ul>
      <p>An option is not required to have a consequence. It can be removed if you wish so.</p>
      <p>Consequences can target important attributes. Using a negative value for <b>changeValue</b> will cause that attribute to drop to negative values eventually.</p>
      <p>Having an important attribute with negative value will immediately cause the player to lose the story.</p>
    </Fragment>
  );
}

export function renderOptionTableTitle () {
  return (
    <HelpCmp text="Options" title={getTitle()} description={getDescription()}/>
  );
}

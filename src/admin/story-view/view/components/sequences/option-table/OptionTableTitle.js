import React from 'react';

import HelpCmp from '../../../../../../shared/components/help/HelpCmp';

function getTitle() {
  return 'Define options for your sequence';
}

function getDescription () {
  return (
    <>
      <p>The options have the following structure:</p>
      <ul>
        <li><b>action</b> The text that will appear to the user when they want to select this option</li>
        <li><b>leadsTo</b> The sequence that will follow after this option is chosen</li>
        <li><b>consequences</b> One or more consequences that will take effect once the option has been chosen</li>
        <li><b>requirements</b> One or more requirements that are needed in order for that option to be displayed to the user</li>
      </ul>
      <span>The consequences have the following structure:</span>
      <ul>
        <li><b>attribute</b> The attribute that they will affect</li>
        <li><b>changeValue</b> The value which dictates how the original value of the attribute will change</li>
      </ul>
      <span>The requirements have the following structure:</span>
      <ul>
        <li><b>attribute</b> The attribute that need</li>
        <li><b>value</b> The value that needs to be fulfilled</li>
      </ul>
      <span>Example:</span>
      <ul>
        <li>An option which the following consequences: -10 Coins; +1 Sword; can be used to give a player a sword for 10 coins</li>
        <li>The above option does, however, have a requirement of 10 Coins. If the requirement is not met, the option will not be shown to the user</li>
      </ul>
      <p>An option is not required to have consequences or requirements. They can be removed if you wish so.</p>
      <p>Consequences can target important attributes. Using a negative value for <b>changeValue</b> will cause that attribute to drop to negative values eventually.</p>
      <p>Having an important attribute with negative value will immediately cause the player to lose the story and be shown the linked sequence of the attribute.</p>
    </>
  );
}

export function renderOptionTableTitle () {
  return (
    <HelpCmp text="Options" title={getTitle()} description={getDescription()}/>
  );
}

import React from 'react';
import { Typography } from '@material-ui/core';

import HelpCmp from '../../../../../../shared/components/help/HelpCmp';

function getTitle() {
  return 'Define options for your sequence';
}

function getDescription () {
  return (
    <>
      <Typography>The options have the following structure:</Typography>
      <ul>
        <li>
          <Typography>
            <b>action</b> - The text that will appear to the user when they want to select this option
          </Typography>
        </li>
        <li>
          <Typography>
            <b>leadsTo</b> - The sequence that will follow after this option is chosen
          </Typography>
        </li>
        <li>
          <Typography>
            <b>consequences</b> - One or more consequences that will take effect once the option has been chosen
          </Typography>
        </li>
        <li>
          <Typography>
            <b>requirements</b> - One or more requirements that are needed in order for that option to be displayed to the user
          </Typography>
        </li>
      </ul>
      <Typography>The consequences have the following structure:</Typography>
      <ul>
        <li>
          <Typography>
            <b>attribute</b> - The attribute that they will affect
          </Typography>
        </li>
        <li>
          <Typography>
            <b>changeValue</b> - The value which dictates how the original value of the attribute will change
          </Typography>
        </li>
      </ul>
      <Typography>The requirements have the following structure:</Typography>
      <ul>
        <li>
          <Typography>
            <b>attribute</b> - The attribute that need
          </Typography>
        </li>
        <li>
          <Typography>
            <b>value</b> - The value that needs to be fulfilled
          </Typography>
        </li>
      </ul>
      <Typography>For example, given an option with the following</Typography>
      <ul>
        <li>
          <Typography>Consequences: <b>-10</b> Coins; <b>+1</b> Sword</Typography>
        </li>
        <li>
          <Typography>Requirements: <b>10</b> Coins</Typography>
        </li>
      </ul>
      <Typography>
        A player will see this option only if they have at least <b>10</b> Coins and may or may not accept it
      </Typography>
      <br />
      <Typography>An option is not required to have consequences or requirements. They can be removed if you wish so.</Typography>
      <br />
      <Typography>Consequences can target important attributes. Using a negative value for <b>changeValue</b> will cause that attribute to drop to negative values eventually. If an <b>important</b> attribute reaches 0 or a negative value, the player will immediately lose the story and they will be shown the linked sequence of the attribute that caused this.</Typography>
    </>
  );
}

export function renderOptionTableTitle () {
  return (
    <HelpCmp text="Options" title={getTitle()} description={getDescription()}/>
  );
}

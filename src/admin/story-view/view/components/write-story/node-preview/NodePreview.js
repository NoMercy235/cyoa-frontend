import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Divider, Drawer, Typography, withStyles } from '@material-ui/core';

import { SequenceModel } from '../../../../../../infrastructure/models/SequenceModel';
import { StoryModel } from '../../../../../../infrastructure/models/StoryModel';
import { OptionModel } from '../../../../../../infrastructure/models/OptionModel';
import { OPTIONS_ADMIN_TABLE } from '../../../../../../shared/constants/tables';
import { renderOptionTableTitle } from '../../sequences/option-table/OptionTableTitle';
import TableCmp from '../../../../../../shared/components/table/TableCmp';

import { styles } from './NodePreview.css';

class NodePreview extends Component {

  renderNextSeqName = ({ nextSeq }) => {
    const seq = this.props.sequences.find(({ _id }) => _id === nextSeq);
    return seq && seq.name;
  };

  renderConsequenceCell = option => {
    return option.consequences
      .filter(c => c.attribute)
      .map((attr, i) =>
        <div key={i}>
          <b>{attr.attribute}</b>&nbsp;:&nbsp;<b>{attr.changeValue}</b>
        </div>
      );
  };

  renderOptionsTable = () => {
    const { options = [] } = this.props;

    console.log(options);

    const data = options.map(option => {
      return [
        option.action,
        this.renderNextSeqName(option),
        this.renderConsequenceCell(option),
      ];
    });

    return (
      <TableCmp
        id={OPTIONS_ADMIN_TABLE}
        title={renderOptionTableTitle()}
        columns={OptionModel.getTableColumns()}
        data={data}
        options={{
          search: false,
          textLabels: {
            body: {
              noMatch: 'No options available',
            },
          }
        }}
      />
    );
  };

  render () {
    const { classes, open, sequence = {}, onDrawerClose } = this.props;

    // TODO: retrieve the picture and show it

    return (
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onDrawerClose}
        classes={{ paperAnchorBottom: classes.drawer }}
      >
        <div className={classes.previewContainer}>
          <Typography variant="h6">
            {sequence.name}
          </Typography>
          <Divider className={classes.divider}/>
          <Typography>
            {sequence.content}
          </Typography>
          <Divider className={classes.divider}/>
          {this.renderOptionsTable()}
        </div>
      </Drawer>
    );
  }
}

NodePreview.propTypes = {
  classes: PropTypes.object,
  open: PropTypes.bool.isRequired,
  story: PropTypes.instanceOf(StoryModel),
  sequences: PropTypes.arrayOf(PropTypes.instanceOf(SequenceModel)),
  sequence: PropTypes.instanceOf(SequenceModel),
  options: PropTypes.arrayOf(PropTypes.instanceOf(OptionModel)),

  onDrawerClose: PropTypes.func.isRequired,
};

export default withStyles(styles)(NodePreview);

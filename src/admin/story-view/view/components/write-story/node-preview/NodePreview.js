import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { IconButton, Divider, Drawer, Typography, withStyles, Tooltip } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

import { SequenceModel } from '../../../../../../infrastructure/models/SequenceModel';
import { StoryModel } from '../../../../../../infrastructure/models/StoryModel';
import { OptionModel } from '../../../../../../infrastructure/models/OptionModel';
import { OPTIONS_ADMIN_TABLE } from '../../../../../../shared/constants/tables';
import { renderOptionTableTitle } from '../../sequences/option-table/OptionTableTitle';
import TableCmp from '../../../../../../shared/components/table/TableCmp';
import { parseContent } from '../../../../../../shared/utilities';
import { SEQUENCE_PICTURE_CROPPER_SIZE } from '../../../../../../shared/constants/sequences';
import TextWithImage from '../../../../../../shared/components/text-with-image/TextWithImage';
import { renderConsequenceCell, renderRequirementCell } from '../../../../../../shared/utils/optionsUtils';

import { styles } from './NodePreview.css';

class NodePreview extends Component {

  renderNextSeqName = ({ nextSeq }) => {
    const seq = this.props.sequences.find(seq => seq._id === nextSeq);
    return seq && seq.name;
  };

  renderOptionsTable = () => {
    const { options = [] } = this.props;

    const data = options.map(option => {
      return [
        option.action,
        this.renderNextSeqName(option),
        renderConsequenceCell(option),
        renderRequirementCell(option),
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

  renderPreviewHeader = () => {
    const { classes, sequence = {}, onDrawerClose } = this.props;
    return (
      <div className={classes.header}>
        <Typography
          className={classes.sequenceName}
          variant="h6"
        >
          {sequence.name}
        </Typography>
        <Tooltip title="Close">
          <IconButton onClick={onDrawerClose}>
            <CloseIcon/>
          </IconButton>
        </Tooltip>
      </div>
    );
  };

  render () {
    const { classes, open, sequence = {}, onDrawerClose } = this.props;

    return (
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onDrawerClose}
        classes={{ paperAnchorBottom: classes.drawer }}
      >
        {open && (
          <div className={classes.previewContainer}>
            {this.renderPreviewHeader()}
            <Divider className={classes.divider}/>
            <TextWithImage
              image={sequence.scenePic}
              size={SEQUENCE_PICTURE_CROPPER_SIZE}
              text={parseContent(sequence.content)}
            />
            <Divider className={classes.divider}/>
            {this.renderOptionsTable()}
          </div>
        )}
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

import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Field, Form } from 'formik';
import TextField from '@material-ui/core/TextField';
import { withStyles } from '@material-ui/core';
import { styles } from './SaveSequence.css';
import { hasError } from '../../../../../../shared/components/form/helpers';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import FileSelect from '../../../../../../shared/components/form/FileSelect/FileSelect';

class SaveSequenceForm extends Component {
  onFileUploaded = base64File => {
    this.props.formik.setFieldValue('scenePic', base64File);
  };

  render() {
    const { formik, classes } = this.props;

    return (
      <Form noValidate>
        <Field
          name="name"
          required
          render={({ field }) => {
            return <TextField
              {...field}
              label="Name"
              fullWidth
              value={formik.values.name}
              {...hasError(formik, 'name')}
            />;
          }}
        />
        <Field
          name="authorNote"
          required
          render={({ field }) => {
            return <TextField
              {...field}
              label="Author's note"
              fullWidth
              value={formik.values.authorNote}
              {...hasError(formik, 'authorNote')}
            />;
          }}
        />
        <Typography
          className={classes.isStartSeqContainer}
          variant="inherit"
          color="inherit"
          noWrap
        >
          Start the story with this sequence?
          <Field
            name="isStartSeq"
            render={({ field }) => {
              return <Checkbox
                {...field}
                checked={formik.values.isStartSeq}
                value=""
              />;
            }}
          />
        </Typography>
        <Typography
          className={classes.isStartSeqContainer}
          variant="inherit"
          color="inherit"
          noWrap
        >
          Is this an ending sequence?
          <Field
            name="isEnding"
            render={({ field }) => {
              return <Checkbox
                {...field}
                checked={formik.values.isEnding}
                value=""
              />;
            }}
          />
        </Typography>
        <Field
          name="content"
          required
          render={({ field }) => {
            return <TextField
              {...field}
              type="text"
              label="Content"
              fullWidth
              multiline
              rows={10}
              value={formik.values.content}
              {...hasError(formik, 'content')}
            />;
          }}
        />

        <FileSelect
          className={classes.uploadBtn}
          label="Upload scene"
          onFileUploaded={this.onFileUploaded}
        />
      </Form>
    );
  }
}

SaveSequenceForm.propTypes = {
  classes: PropTypes.object.isRequired,
  formik: PropTypes.object.isRequired,
};

export default withStyles(styles)(SaveSequenceForm);

import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Form } from 'formik';
import { withStyles } from '@material-ui/core';

import { ChapterModel } from '../../../../../../infrastructure/models/ChapterModel';
import { renderInput } from '../../../../../../shared/utils/formUtils';

import { styles } from './SaveChapter.css';

class SaveChapterForm extends Component {
  render() {
    const { formik } = this.props;
    return (
      <Form noValidate>
        {renderInput(formik, {
          label: 'Name',
          name: 'name',
          fullWidth: true,
        })}
        {renderInput(formik, {
          label: 'Description',
          name: 'description',
          fullWidth: true,
          textarea: {
            rows: 3,
          },
          required: false,
        })}
      </Form>
    );
  }
}

SaveChapterForm.propTypes = {
  classes: PropTypes.object.isRequired,
  chapters: PropTypes.arrayOf(PropTypes.instanceOf(ChapterModel)).isRequired,
  formik: PropTypes.object.isRequired,
};

export default withStyles(styles)(SaveChapterForm);

import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Formik } from 'formik';
import { Typography } from '@material-ui/core';

import BasicFormActions from '../../../../../shared/components/form/BasicFormActions';
import { renderInput } from '../../../../../shared/formUtils';
import { UserModel } from '../../../../../infrastructure/models/UserModel';

import styles from './ProfileForm.module.scss';

class ProfileForm extends Component {
  onCancel = formik => () => {
    formik.resetForm();
  };

  validate = values => {
    const { user } = this.props;
    const model = new UserModel(Object.assign(user, values));
    return model.checkErrors();
  };

  renderForm = (formik) => {
    return (
      <>
        <div className={styles.fieldsContainer}>
          {renderInput(formik, { label: 'Email', name: 'email', disabled: true })}
          {renderInput(formik, { label: 'First Name', name: 'firstName', })}
          {renderInput(formik, { label: 'Last Name', name: 'lastName', })}
        </div>
        {renderInput(
          formik,
          {
            className: styles.descriptionField,
            label: 'Some words about you',
            name: 'description',
            textarea: { rows: 6 },
            required: false,
            fullWidth: true,
          }
        )}
        {formik.dirty && (
          <div className={styles.buttonsContainer}>
            <BasicFormActions
              formik={formik}
              onClose={this.onCancel(formik)}
            />
          </div>
        )}
      </>
    );
  };

  render () {
    const {
      user: { email, firstName, lastName, description },
      onUpdateUser
    } = this.props;

    return (
      <div className={styles.container}>
        <Typography variant="h6">
          Details
        </Typography>
        <Formik
          enableReinitialize={true}
          initialValues={{ email, firstName, lastName, description }}
          onSubmit={onUpdateUser}
          validate={this.validate}
        >
          {this.renderForm}
        </Formik>
      </div>
    );
  }
}

ProfileForm.propTypes = {
  user: PropTypes.instanceOf(UserModel).isRequired,
  onUpdateUser: PropTypes.func.isRequired,
};

export default ProfileForm;

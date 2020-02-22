import React, { Component } from 'react';
import * as PropTypes from 'prop-types';
import { Formik } from 'formik';

import BasicFormActions from '../../../../shared/components/form/BasicFormActions';
import { renderInput } from '../../../../shared/formUtils';
import { UserModel } from '../../../../infrastructure/models/UserModel';

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
        {renderInput(formik, { label: 'Email', name: 'email', disabled: true })}
        {renderInput(formik, { label: 'First Name', name: 'firstName', })}
        {renderInput(formik, { label: 'Last Name', name: 'lastName', })}
        {formik.dirty && (
          <BasicFormActions
            formik={formik}
            onClose={this.onCancel(formik)}
          />
        )}
      </>
    );
  };

  render () {
    const {
      user: { email, firstName, lastName },
      onUpdateUser
    } = this.props;

    return (
      <Formik
        enableReinitialize={true}
        initialValues={{ email, firstName, lastName }}
        onSubmit={onUpdateUser}
        validate={this.validate}
      >
        {this.renderForm}
      </Formik>
    );
  }
}

ProfileForm.propTypes = {
  user: PropTypes.instanceOf(UserModel).isRequired,
  onUpdateUser: PropTypes.func.isRequired,
};

export default ProfileForm;

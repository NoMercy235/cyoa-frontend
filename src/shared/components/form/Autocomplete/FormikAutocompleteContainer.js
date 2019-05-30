import React, { Component } from 'react';
import * as PropTypes from 'prop-types';

import Autocomplete from './Autocomplete';
import { KeyCode } from '../../../utilities';
import { hasError } from '../helpers';

class FormikAutocompleteContainer extends Component {
  static defaultProps = {
    searchOnFocus: false,
  };

  state = {
    suggestions: [],
  };

  setSuggestions = async searchQuery => {
    if (searchQuery === null) {
      this.setState({ suggestions: [] });
      return;
    }

    const { onSearchRequest } = this.props;

    const suggestions = await onSearchRequest(searchQuery);
    this.setState({ suggestions });
  };

  onChange = selected => {
    const { formik, field } = this.props;
    formik.setFieldValue(field.name, selected);
  };

  onInputChange = value => {
    value && this.setSuggestions(value);
  };

  onFocus = () => {
    const { formik, field, searchOnFocus } = this.props;
    formik.setFieldTouched(field.name, true, false);
    searchOnFocus && this.setSuggestions('');
  };

  onBlur = e => {
    const { formik } = this.props;
    formik.handleBlur(e);
    this.setSuggestions(null);
  };

  onKeyDown = event => {
    // Reset the field on backspace press
    if (event.keyCode === KeyCode.Backspace) {
      const { formik, field } = this.props;
      formik.setFieldValue(field.name, '');
    }
  };

  render() {
    const {
      formik,
      field,
      label,
      placeholder,
    } = this.props;

    const { suggestions } = this.state;

    const inputProps = {
      label: label,
      ...hasError(formik, field.name),
    };

    return (
      <Autocomplete
        placeholder={placeholder}
        inputProps={inputProps}
        value={field.value}
        suggestions={suggestions}
        onChange={this.onChange}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onKeyDown={this.onKeyDown}
        onInputChange={this.onInputChange}
      />
    );
  }
}

FormikAutocompleteContainer.propTypes = {
  formik: PropTypes.object.isRequired,
  field: PropTypes.object.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  searchOnFocus: PropTypes.bool,
  onSearchRequest: PropTypes.func.isRequired,
};

export default FormikAutocompleteContainer;

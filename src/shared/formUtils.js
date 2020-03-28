import React from 'react';
import { Field } from 'formik';
import { TextField, Typography, Checkbox } from '@material-ui/core';

import { hasError } from './components/form/helpers';
import FormikAutocompleteContainer from './components/form/Autocomplete/FormikAutocompleteContainer';
import Select from './components/form/Select/Select';

export const renderInput = (
  formik,
  {
    label,
    name,
    className,
    disabled,
    required = true,
    textarea = {},
    fullWidth = false,
  }
) => {
  return (
    <Field
      name={name}
      required={required}
      render={({ field }) => {
        return (
          <TextField
            {...field}
            label={label}
            className={className}
            value={formik.values[name]}
            disabled={disabled}
            multiline={!!textarea}
            rows={textarea.rows}
            fullWidth={fullWidth}
            {...(required ? hasError(formik, name) : {})}
          />
        );
      }}
    />
  );
};

export const renderAutocompleteInput = (
  formik,
  {
    label,
    name,
    disabled,
    required = true,
    searchOnFocus = true,
    placeholder,
    onSearchRequest,
  }
) => {
  return (
    <Field
      name={name}
      required={required}
      render={({ field }) => {
        return (
          <FormikAutocompleteContainer
            formik={formik}
            field={field}
            disabled={disabled}
            label={label}
            placeholder={placeholder}
            searchOnFocus={searchOnFocus}
            onSearchRequest={onSearchRequest}
          />
        );
      }}
    />
  );
};

export const renderSelectInput = (
  formik,
  {
    label,
    name,
    className,
    disabled,
    required,
    items,
  }
) => {
  return (
    <Field
      name={name}
      required={required}
      render={({ field }) => {
        return (
          <Select
            formikField={field}
            label={label}
            className={className}
            value={formik.values[name]}
            disabled={disabled}
            items={items}
            {...(required ? hasError(formik, name) : {})}
          />
        );
      }}
    />
  );
};

export const renderCheckboxInput = (
  formik,
  {
    label,
    name,
    className,
    disabled,
    required = true,
  }
) => {
  return (
    <Typography
      className={className}
      noWrap
    >
      {label}
      <Field
        name={name}
        required={required}
        render={({ field }) => {
          return (
            <Checkbox
              {...field}
              disabled={disabled}
              checked={formik.values[name]}
              value=""
            />
          );
        }}
      />
    </Typography>
  );
};

export const submitAndValidateForm = async formik => {
  formik.submitForm();
  const errors = await formik.validateForm();
  return Object.keys(errors).length > 0 ? errors : undefined;
};

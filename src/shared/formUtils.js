import React from 'react';
import { Field } from 'formik';
import { Checkbox, TextField, Typography } from '@material-ui/core';

import FormikAutocompleteContainer from './components/form/Autocomplete/FormikAutocompleteContainer';
import Select from './components/form/Select/Select';
import { ERRORS } from './constants/errors';

export const handleConflictError = errArr => {
  if (!Array.isArray(errArr)) return {};
  let result = {};
  errArr.forEach(field => result[field] = ERRORS.fieldMustBeUnique);
  return result;
};

export const arrayToSelectFieldOptions = (
  arr,
  { idProp = '_id', labelProp = 'name' } = {},
) => {
  return arr.map(item => {
    return { _id: item[idProp], name: item[labelProp] };
  });
};

const getNestedPropertyFromStringPath = (obj, pathParts) => {
  if (pathParts.length === 1) return obj[pathParts[0]];
  return getNestedPropertyFromStringPath(obj[pathParts[0]], pathParts.splice(1))
};

export function hasError (formik, fieldName) {
  const path = fieldName.split('.');
  const touched = getInnerObject(formik.touched, path);
  if (!touched) {
    return {};
  }
  const errorText = getInnerObject(formik.errors, path);
  return {
    helperText: errorText,
    error: !!errorText,
  };
}

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
            value={getNestedPropertyFromStringPath(formik.values, name.split('.'))}
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
            value={getNestedPropertyFromStringPath(formik.values, name.split('.'))}
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
    defaultValue,
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
              checked={!!getNestedPropertyFromStringPath(formik.values, name.split('.'))}
              value={defaultValue}
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

export function getInnerObject (obj, path, stopBefore = 0) {
  if (path.length > stopBefore) {
    if (!obj[path[0]]) return '';
    return getInnerObject(obj[path[0]], path.slice(1), stopBefore);
  } else {
    return obj;
  }
}

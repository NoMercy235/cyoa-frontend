import React from 'react';
import { Field } from 'formik';
import { hasError } from './components/form/helpers';
import { TextField } from '@material-ui/core';

export const renderInput = (
  formik,
  {
    label,
    name,
    className,
    disabled,
    required = true,
    textarea = {}
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
            {...(required ? hasError(formik, name) : {})}
          />
        );
      }}
    />
  );
};

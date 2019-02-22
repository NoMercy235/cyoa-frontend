import { BaseModel } from '../../../infrastructure/models/BaseModel';

function getInnerObject(obj, path, stopBefore = 0) {
  if (path.length > stopBefore) {
    if (!obj[path[0]]) return '';
    return getInnerObject(obj[path[0]], path.slice(1), stopBefore);
  } else {
    return obj;
  }
}

export function hasError(formik, fieldName) {
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

/**
 * How to use: fieldPath will contain only the path to the array inside formik.
 * fieldName will contain the name of the attribute that is found in each object of the array
 * index is the the index of the element that should be mapped to the error.
 * The error object will contain a property called index that has this sole purpose.
 */
export function arrayHasError(formik, fieldPath, fieldName, index) {
  const path = fieldPath.split('.');
  const touched = getInnerObject(formik.touched, path);
  if (!touched) {
    return {};
  }

  const array = getInnerObject(formik.errors, path);

  if (!array) {
    return {};
  }

  const errorObj = array.find(el => el.index === index);

  if (!errorObj) {
    return {};
  }

  const errorText = errorObj[fieldName];

  return {
    helperText: errorText,
    error: !!errorText,
  };
}

export async function withSnackbar (innerFunction, params, successMsg) {
  let message = successMsg;
  let variant = 'success';
  try {
    return await innerFunction(...params);
  } catch (e) {
    variant = 'error';
    message = BaseModel.handleError(e);
    throw e;
  } finally {
    this.setState({
      open: true,
      variant,
      message,
    });
  }
}

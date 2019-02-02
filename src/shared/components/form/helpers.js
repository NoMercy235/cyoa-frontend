import { BaseModel } from '../../domain/models/BaseModel';

function getInnerObject(obj, path) {
  if (path.length) {
    if (!obj[path[0]]) return '';
    return getInnerObject(obj[path[0]], path.slice(1));
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

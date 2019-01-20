import { BaseModel } from '../../domain/models/BaseModel';

export function hasError(formik, fieldName) {
  if (!formik.touched[fieldName]) {
    return {};
  }
  return {
    helperText: formik.errors[fieldName],
    error: !!formik.errors[fieldName],
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
  } finally {
    this.setState({
      open: true,
      variant,
      message,
    });
  }
}

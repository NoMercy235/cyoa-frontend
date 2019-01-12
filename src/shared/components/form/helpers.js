export function hasError(formik, fieldName) {
  if (!formik.touched[fieldName]) {
    return {};
  }
  return {
    helperText: formik.errors[fieldName],
    error: !!formik.errors[fieldName],
  };
}

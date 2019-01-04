export class BaseModel {
  static handleError(e) {
    if (!e.errors) return e.message;
    return Object.keys(e.errors)
      .filter(key => !key.startsWith('_'))
      .map(key => e.errors[key].message)
      .join('. ');
  }
}

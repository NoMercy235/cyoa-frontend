export class BaseModel {
  static handleError(e) {
    // Error set by the server
    if (e.message) return e.message;

    // Duplicate key error set by Mongo.
    if (e.code && e.code === 11000) {
      return `Duplicate value: ${e.errmsg.match(/"[\s\S]+"/)[0]}`;
    }

    return 'An error has occured';
  }
}

export class BaseModel {
  static handleError(e) {
    // Error set by the server
    if (e.message) return e.message;

    return 'An error has occurred';
  }
}

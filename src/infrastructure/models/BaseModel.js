export class BaseModel {
  _id = '';
  _customId = '';

  set id (value) {
    this._customId = value;
  }

  get id () {
    return this._customId || this._id;
  }

  static handleError(e) {
    // Error set by the server
    if (e.message) return e.message;

    return 'An error has occurred';
  }
}

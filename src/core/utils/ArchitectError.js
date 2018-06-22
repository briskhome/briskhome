/* @flow */

class ArchitectError extends Error {
  constructor(message: string, code: string, data: Object) {
    super(message);
    this.message = message;
    this.code = code;
    this.data = data;

    Error.captureStackTrace(this, this.constructor);
  }

  toString() {
    return this.message;
  }
}

export default ArchitectError;

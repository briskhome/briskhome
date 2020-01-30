class ArchitectError extends Error {
  code: string;
  message: string;
  data: object | undefined | null;

  constructor(message: string, code: string, data: object | undefined | null = null) {
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
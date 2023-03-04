class ConflictRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConflictRequestError';
    this.statusCode = 409;
  }
}
module.exports = ConflictRequestError;

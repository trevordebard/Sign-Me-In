module.exports = class Response {
  constructor(status, reason, payload) {
    this.status = status;
    this.reason = reason;
    this.payload = payload;
  }
};

// Encapsulates an API Error that has a status code (HTTP error code) and a message
class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export default ApiError;

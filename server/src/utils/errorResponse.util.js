// utils/ErrorResponse.js
class ErrorResponse extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        
        // This ensures the error shows up in the stack trace correctly
        Error.captureStackTrace(this, this.constructor);
    }
}

export default ErrorResponse;
// middleware/error.js
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
    console.error(`fatal error (error handler middleware.js) is: `,error.message)
    // Log for the developer
    // console.error(`Error: ${err.message}`.red);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        error.message = `Resource not found`;
        error.statusCode = 404;
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        error.message = 'Duplicate field value entered';
        error.statusCode = 400;
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Internal Server Error'
    });
};

export default errorHandler;
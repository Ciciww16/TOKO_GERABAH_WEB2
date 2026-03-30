// backend/middleware/errorHandler.js
export const notFound = (req, res, next) => {
    const error = new Error(`🔍 Route not found - ${req.originalUrl}`);
    error.status = 404;
    next(error);
};

export const errorHandler = (err, req, res, next) => {
    const statusCode = err.status || 500;
    const message = err.message || 'Internal Server Error';

    // Log error
    console.error(`❌ Error: ${message}`);
    if (err.stack) {
        console.error(err.stack);
    }

    res.status(statusCode).json({
        success: false,
        msg: message,
        error: process.env.NODE_ENV === 'development' ? {
            stack: err.stack,
            details: err
        } : undefined,
        timestamp: new Date().toISOString()
    });
};
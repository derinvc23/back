const { BaseError } = require('../../domain/errors');

const errorHandler = (err, req, res, next) => {
    if (err instanceof BaseError) {
        return res.status(err.statusCode).json({
            error: err.message
        });
    }

    console.error('Unexpected error:', err);
    return res.status(500).json({
        error: 'An internal server error occurred'
    });
};

module.exports = errorHandler;

const morgan = require('morgan');
const logger = require('../utils/logger');

const startRequest = (req, res, next) => {
    req.start = Date.now();
    next();
};

const requestLogger = () => {
    if (global.process.env.NODE_ENV === 'test') {
        return (req, res, next) => next();
    }
    morgan.token('body', (req) => JSON.stringify(req.body));

    return morgan(':method :url :status :res[content-length] - :response-time ms :body');
};

const unknownEndpoint = (req, res) => res.status(404).send({ error: 'unknown endpoint' });

const errorHandler = (error, req, res, next) => {
    logger.error(error.message);
    if (error.name === 'CastError' && error.kind === 'ObjectId') {
        return res.status(400).send({ error: 'malformed id' });
    } else if (error.name === 'ValidationError') {
        return res.status(400).send({ error: error.message });
    }
    next(error);
};

module.exports = {
    startRequest,
    requestLogger,
    unknownEndpoint,
    errorHandler,
};

const debug = require('debug')

const log = debug('handler')

const appHandler = {
    notFound(req, res, next) {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
    },
    handleError(err, req, res, next) {
        if (err.status !== 404) log(err.stack);
        res.status(err.status || 500).json({ err: err.message });
    },
};

module.exports = appHandler

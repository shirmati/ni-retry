'use strict';

const middleware = {
    retryMiddleware : require('./lib/middleware/retry-middleware')
};
const registerRealtimeSchemas = require('./lib/helpers/dbInit');

const niRetry = {
middleware,registerRealtimeSchemas
};
module.exports = niRetry;

'use strict';

module.exports = function(db, serviceName) {

  return {
    middleware: {
      retryMiddleware: require('./lib/middleware/retry-middleware')(db,serviceName),
      auditLogMiddleware: require('./lib/middleware/audit-log-middleware')(db,serviceName),
    },
    registerRealtimeSchemas : require('./lib/helpers/dbInit')(db)
  }
};

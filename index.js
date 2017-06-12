'use strict';

module.exports = function(app,db, serviceName) {
  let instance;

  if (!instance){
    instance = {
      middleware: {
        retryMiddleware: require('./lib/middleware/retry-middleware')(app,db,serviceName),
        auditLogMiddleware: require('./lib/middleware/audit-log-middleware')(db,serviceName),
      },
      helpers: {
        dbHelper: require('./lib/helpers/dbHelper')(db,serviceName)
      },
      registerRealtimeSchemas : require('./lib/helpers/dbInit')(db)
    }
  }
  return instance;
};

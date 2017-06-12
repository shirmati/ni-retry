'use strict';

module.exports = function(app,db, serviceName,niRetryServiceMapping) {
  let instance;

  if (!instance){
    instance = {
      middleware: {
        retryMiddleware: require('./lib/middleware/retry-middleware')(app,db,serviceName,niRetryServiceMapping)
      },
      helpers: {
        dbHelper: require('./lib/helpers/dbHelper')(db,serviceName)
      },
      registerRealtimeSchemas : require('./lib/helpers/dbInit')(db)
    }
  }
  return instance;
};

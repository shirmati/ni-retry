'use strict';
const registerRealtimeSchemas = require('../helpers/dbInit');
const contextProvider = require('ni-context').context;
const setIntervalDuration = process.env.NI_RETRY_INTERVAL || 1; // in minutes
module.exports = function (app,db,serviceName) {
  const __db = db;
  let loaded = false;
  const dbHelper = require('../helpers/dbHelper')(__db);
  return function createMiddleware(req, res, next) {
    if(loaded) return next();
    loaded = true;
    const CronJob = require('cron').CronJob;
    const job = new CronJob('* * * * * *',  function() {

      const failedAudits = dbHelper.getFailedAudits().then((failedAudits)=>{
        for (const audit of failedAudits) {
          req.url = audit.url;
          req.params = audit.routeParams;
          req.body = audit.auditPayload;
          app._router.handle(req, res);
        }
        next();
      });

    }, null, true, 'America/Los_Angeles');

  }
};

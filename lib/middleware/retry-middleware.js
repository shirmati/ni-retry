'use strict';

const retryInterval = process.env.NI_RETRY_INTERVAL || 1; // in minutes
module.exports = function (app=null, db, serviceName, serviceMapping) {
  const __db = db;
  const origin = serviceName;
  const __serviceMapping = serviceMapping;
  let loaded = false;
  const dbHelper = require('../helpers/dbHelper')(__db, origin);

  return function createMiddleware(req, res, next) {
    if (loaded) return next();
    loaded = true;
    console.log('loaded cron job');
    const CronJob = require('cron').CronJob;
    const job = new CronJob(`${retryInterval} * * * * *`, function () {

      dbHelper.getFailedAudits().then( async(failedAudits) => {
        if(failedAudits.length) {
          console.log(`running cron job on ${failedAudits.length} failed audits`);
        }
        let services = [];

        for (const audit of failedAudits) {
          if(!services[audit.service]) {
            continue;
          }
          audit.attempts ++;
          await services[audit.entity].sendRequest(audit.payload, audit.action, audit.inId)
        }
      });

    }, null, true, 'America/Los_Angeles');
    return next();
  }
};

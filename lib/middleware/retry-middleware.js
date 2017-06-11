'use strict';
const registerRealtimeSchemas = require('../helpers/dbInit');
const contextProvider = require('ni-context').context;
const setIntervalDuration = process.env.NI_RETRY_INTERVAL || 100;
module.exports = function (db,serviceName) {
  const app = require('express');
  const __db = db;
  const dbHelper = require('../helpers/dbHelper')();
  return function createMiddleware(req, res, next) {
    setInterval( async() =>{
      const failedAudits = await  dbHelper.getFailedAudits();
      for (const audit of failedAudits) {
        req.url = audit.url;
        req.params = audit.routeParams;
        req.body = audit.auditPayload;
        app._router.handle(req, res);
      }

    },setIntervalDuration);
    next();
  };

};


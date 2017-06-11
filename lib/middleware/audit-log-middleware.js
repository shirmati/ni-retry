
const contextProvider = require('ni-context').context;

module.exports = function (db,serviceName) {
  const __db = db;
  return function createMiddleware(req, res, next) {
    const payloadHelper = require('../helpers/payloadHelper')(__db, serviceName);
    const dbHelper = require('../helpers/dbHelper')();

    const {params, body, url} = req;
    const payloadHash = payloadHelper.generateHash(serviceName,params, body, url);
    const contextProvider = require('ni-context').context;
    const contextMiddleWare = require('ni-context').getMiddleware();
    const context = contextProvider.create();
    const niContext = context.getId();
    dbHelper.createOrUpdateAudit(__db, body, niContext, serviceName, params , url, payloadHash)
      .then( () => next())
      .catch( (err) => {
        console.log(err   );
        next();
      })
  }
};

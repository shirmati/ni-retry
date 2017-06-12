module.exports = function (db,service) {
  return function createMiddleware(req, res, next) {
    const dbHelper = require('../helpers/dbHelper')();

    const {params, body, url, method} = req;

    if (['POST', 'PUT', 'DELETE'].includes(method)) {
      dbHelper.createOrUpdateAudit(service, params, body, url)
        .then(() => next())
        .catch((err) => {
          console.log(err);
          next();
        })
    }
  }
};

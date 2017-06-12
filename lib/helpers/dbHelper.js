
const dbConnectionHelper = require('ni-data-access-mongo').dbConnectionHelperShim;
const projectConstants = require('../../lib/project-constants');
const contextProvider = require('ni-context').context;

module.exports = function (db = 'backOfficeDb') {
  const dbHelper = {};
  let instance;
  if(!instance){
    const __db = db;
    const context = contextProvider.create();
    const niContext = context.getId();

    dbHelper.createOrUpdateAudit = async function createOrUpdateAudit(service = '', params = {}, body ={}, url='', status=projectConstants.AUDIT_TABLE_STATUS_PENDING) {

      const payloadHelper = require('../helpers/payloadHelper')();
      const payloadHash = payloadHelper.generateHash(service, params, body, url);
      const connectionHelper = dbConnectionHelper.getInstance();
      const connection = connectionHelper.getConnection(__db);
      const audits = connection.model(projectConstants.AUDIT_COLLECTION_NAME);
      const audit = {niContext, service, params, body, url, payloadHash, updatedAt: Date.now()};

      return await audits.findOneAndUpdate({payloadHash}, audit, {upsert: true}).exec();
    };

    dbHelper.getFailedAudits = async function getAudits(service) {
      const connectionHelper = dbConnectionHelper.getInstance();
      const connection = connectionHelper.getConnection(__db);
      const audits = connection.model(projectConstants.AUDIT_COLLECTION_NAME);

      return audits.find({
        service,
        status: {
          $in: [projectConstants.AUDIT_TABLE_STATUS_PENDING, projectConstants.AUDIT_TABLE_STATUS_FAIL]
        }
      }).exec();
    };
    instance = dbHelper;
  }

  return instance;
};

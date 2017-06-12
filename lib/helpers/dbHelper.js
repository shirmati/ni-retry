
const dbConnectionHelper = require('ni-data-access-mongo').dbConnectionHelperShim;
const projectConstants = require('../../lib/project-constants');

module.exports = function (db = 'backOfficeDb', origin) {
  const dbHelper = {};
  let instance;
  if(!instance){
    const __db = db;
    const __origin = origin;
    dbHelper.createOrUpdateAudit = async function createOrUpdateAudit(options) {
      const{service,payload,entity,status,action, inId} = options;
      const payloadHelper = require('../helpers/payloadHelper')();
      const payloadHash = payloadHelper.generateHash(service, payload, entity);
      const connectionHelper = dbConnectionHelper.getInstance();
      const connection = connectionHelper.getConnection(__db);
      const audits = connection.model(projectConstants.AUDIT_COLLECTION_NAME);
      const audit = {origin: __origin, service, payload, entity, payloadHash, updatedAt: Date.now(), status, action,inId};

      return audits.findOneAndUpdate({payloadHash}, audit, {upsert: true}).exec().then((record) => record);
    };

    dbHelper.getFailedAudits = async function getAudits() {
      const connectionHelper = dbConnectionHelper.getInstance();
      const connection = connectionHelper.getConnection(__db);
      const audits = connection.model(projectConstants.AUDIT_COLLECTION_NAME);

      return audits.find({
        origin,
        status: {
          $in: [projectConstants.AUDIT_TABLE_STATUS_PENDING, projectConstants.AUDIT_TABLE_STATUS_FAIL]
        },
        inId: { $ne : null}
      }).exec();
    };
    instance = dbHelper;
  }

  return instance;
};

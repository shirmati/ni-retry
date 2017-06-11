
const dbConnectionHelper = require('ni-data-access-mongo').dbConnectionHelperShim;
const connectionHelper = dbConnectionHelper.getInstance();
const projectConstants = require('../../lib/project-constants');

module.exports = function () {
  const dbHelper = {};

  dbHelper.createOrUpdateAudit = async function createOrUpdateAudit(db = 'backOfficeDb', auditPayload ={}, niContext, service = '', routeParams = {}, url='', payloadHash) {
    const connectionHelper = dbConnectionHelper.getInstance();
    const connection = connectionHelper.getConnection(db);
    const audits = connection.model('Audit');

    const audit = {auditPayload, niContext, service,routeParams,url, payloadHash, updatedAt: Date.now()};

    return await audits.findOneAndUpdate({payloadHash}, audit, {upsert: true}).exec();
  };

  dbHelper.getFailedAudits = async function getAudits(db = 'backOfficeDb', serviceName) {
    const connectionHelper = dbConnectionHelper.getInstance();
    const connection = connectionHelper.getConnection(db);
    const audits = connection.model('Audit');

    return audits.find({
      serviceName,
      status: {
        $in: [projectConstants.AUDIT_TABLE_STATUS_PENDING, projectConstants.AUDIT_TABLE_STATUS_FAIL]
      }
    }).exec();
  };
  return dbHelper;
}

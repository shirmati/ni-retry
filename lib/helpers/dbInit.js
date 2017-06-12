'use strict';

const dbConnectionHelper = require('ni-data-access-mongo').dbConnectionHelperShim;
const projectConstants = require('../../lib/project-constants');

module.exports = function (db) {
  return async function registerRealtimeSchemas() {

    const connectionHelper = dbConnectionHelper.getInstance();
    return connectionHelper.getConnectionPromise(db).then((connection) => {
      const {mongoose} = require('ni-data-access-mongo');
      const Schema = mongoose.Schema;

      // dbHelper.createOrUpdateAudit = async function createOrUpdateAudit(db = 'backOfficeDb', auditPayload ={}, niContext, service = '', routeParams = {}, url='', payloadHash) {
      const auditSchema = new Schema({
        origin: {type: String},
        service: {type: String},
        action: {type: String, enum: ['POST', 'PUT', 'DELETE']},
        payload: {type: Object},
        entity: {type: String},
        payloadHash:  {type: String},
        status: { type: Number, enum: projectConstants.AUDIT_TABLE_STATUSES, default: projectConstants.AUDIT_TABLE_STATUS_PENDING },
        error: {type: String},
        createdAt: {type: Date, default: Date.now},
        updatedAt: {type: Date, default: Date.now},
        attempts: {type: Number, default: 1},
        recordId: {type: String},
        inId: {type: String}
      });
      connection.model(projectConstants.AUDIT_COLLECTION_NAME, auditSchema);
    });
  }
};

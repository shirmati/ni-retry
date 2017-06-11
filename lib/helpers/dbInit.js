'use strict';

const dbConnectionHelper = require('ni-data-access-mongo').dbConnectionHelperShim;
const projectConstants = require('../../lib/project-constants');

module.exports = async function registerRealtimeSchemas() {
  const connectionHelper = dbConnectionHelper.getInstance();
  return connectionHelper.getConnectionPromise('backOfficeDb').then((connection) => {
    const {mongoose} = require('ni-data-access-mongo');
    const Schema = mongoose.Schema;

    const auditSchema = new Schema({
      service: {type: String},
      entity: {type: String},
      action: {type: String, enum: ['POST', 'PUT', 'DELETE']},
      payload: {type: Object},
      status: {type: Number, enum: projectConstants.AUDIT_TABLE_STATUSES, default: projectConstants.AUDIT_TABLE_STATUS_PENDING},
      error: {type: String},
      createdAt: {type: Date, default: Date.now},
      updatedAt: {type: Date, default: Date.now},
      attempts: {type: Number, default: 1},
      recordId: {type: String}
    });
    connection.model('audits', auditSchema);
  });
};

'use strict';

const crypto = require('crypto');
const _ = require('lodash');
const projectConstants = require('../../lib/project-constants');

module.exports = function () {
  const payloadHelper = {};

  payloadHelper.generateHash = function generateHash(service = '', params = {}, payload = {}, url='') {
    const sortedAuditValues = sortObject(Object.assign({auditService: service}, params, payload));

    const hash = crypto.createHash('md5').update(JSON.stringify(sortedAuditValues)).digest("hex");
    return hash;
  };

  return payloadHelper;
};


// Underscore
function sortObject(object) {
  let sortedObj = {};
  let keys = _.keys(object);

  keys = _.sortBy(keys, function (key) {
    return key;
  });

  _.each(keys, function (key) {
    if (typeof object[key] == 'object' && !(object[key] instanceof Array)) {
      sortedObj[key] = sortObject(object[key]);
    } else {
      sortedObj[key] = object[key];
    }
  });

  return sortedObj;

}


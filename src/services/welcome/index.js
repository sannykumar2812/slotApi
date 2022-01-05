/* eslint-disable no-unused-vars */
/* eslint-disable no-async-promise-executor */
const helper = global.helper;
const config = helper.config;
const utilites = require('../../utilities');
const models = require('../../../models');
const logger = utilites.logger;

const log = logger('welcome');
const functionName = "service.welcome";

/**
 * Welcome
 * 
 * @param {object} body
 * 
 */

module.exports = (body) => {
  log.info(functionName, config.test, models.test);
  return new Promise(async (resolve, reject) => {
    if (body) {
      resolve(body);
    } else {
      resolve({ message: "Welcome"});
    }
  })
}
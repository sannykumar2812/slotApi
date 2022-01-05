'use strict'
const utilites = require("../../utilities");
const logger = utilites.logger;

const log = logger('sanitize');
const functionName = "sanitize-middleware";

let sanitize = (req, res, next) => {
  const payload = req.body;
  const sanitized_payload = {};
  log.info(functionName, "Incoming Headers", JSON.stringify(req.headers));
  log.info(functionName, "Req Body", JSON.stringify(payload));

  //Sanitize input payload - Example
  if (payload.Source || payload.source || payload.source_name || payload.sourcename ) {
    sanitized_payload.Source = (payload.Source || payload.source || payload.source_name || payload.sourcename).toString().trim();
  }
  if (payload.appname || payload.app_name || payload.app|| payload.App) {
    sanitized_payload.App = (payload.App || payload.app_name || payload.app|| payload.appname).toString().trim();
  }
  if (payload.startTime  ) {
    sanitized_payload.startTime= (payload.startTime).toString().trim();
  }
  if (payload.endTime ){
    sanitized_payload.endTime = (payload.endTime).toString().trim();
  }
  if (payload.duration) {
    sanitized_payload.duration = (payload.duration).toString().trim();
  }
  if (payload.days) {
    sanitized_payload.days = (payload.days).toString().trim();
  }
  if (payload.slots) {
    sanitized_payload.slots= (payload.slots).toString().trim();
  }
  if (payload.interval) {
    sanitized_payload.interval = (payload.interval).toString().trim();
  }
  if (payload.timezone) {
    sanitized_payload.timezone = (payload.timezone).toString().trim();
  }
  
  req.payload = sanitized_payload;

  next();
}


module.exports = sanitize;
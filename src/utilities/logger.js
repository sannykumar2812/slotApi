const bunyan = require('bunyan');
var httpContext = require('express-http-context');
const env = process.env.NODE_ENV;

const createBunyanLogger = (loggerName, skipContext) => {
  const logLevelObj = {
    testing: 'fatal',
    production: 'info'
  };

  let bunyanConfig = {
    name: loggerName,
    level: env && logLevelObj[env] ? logLevelObj[env] : 'trace'
  };

  let logger = bunyan.createLogger(bunyanConfig);

  let constructLogObj = (level) => {
    //let ctxObj = {};
    return (functionName, action, ...args) => {
      var reqId = httpContext.get('apihash');
      let clientID = httpContext.get('ClientID');
      let apiName = httpContext.get('ApiName');
      try {
        let errorType = "NA";
        if (level === 'error') {
          if (args[0] instanceof Error) {
            errorType = 'internal';
          } else {
            errorType = 'external';
          }
        }
        if (!skipContext) {
          logger[level]({
            apiHash: reqId,
            clientId: clientID,
            apiName: apiName,
            logType: level,
            errorType,
            functionName,
            action,
          }, ...args);
        } else {
          // logger[level]({
          //   ApiHash: ctxObj.get('ApiHash')
          // }, ...args);
        }
      } catch (error) {
        logger.error('Error in fetching Api Hash');
        logger.error(error);
        logger[level](...args);
      }
    };
  };
  let logObj = {
    info: constructLogObj('info'),
    trace: constructLogObj('trace'),
    debug: constructLogObj('debug'),
    warn: constructLogObj('warn'),
    error: constructLogObj('error'),
    fatal: constructLogObj('fatal')
  };
  return logObj;
};


module.exports = createBunyanLogger;
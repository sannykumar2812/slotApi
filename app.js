/* eslint-disable no-unused-vars */
const express = require('express');
const httpContext = require('express-http-context');
const cookieParser = require('cookie-parser');
const uuid = require('uuid');
const helpers = require('./helpers');
const config = require('./config');
const boot =  require('./boot');
const logger = require('./src/utilities/logger');



const log = logger('app:main');
const functionName = "appJs";


const env = process.env.NODE_ENV;
if(env === 'production'){
  try {
    require('./prodModules');
  } catch(e) {
    // eslint-disable-next-line no-console
    console.log('ERROR in prodModules file', e);
  } 
}

global.helper = {
  config,
  module: helpers.module
}

const app = express();

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(httpContext.middleware);

app.use((req, res, next) => {
  httpContext.ns.bindEmitter(req);
  httpContext.ns.bindEmitter(res);
  const ApiHash = req.headers.ApiHash || req.headers.apihash || req.headers.apiID || uuid.v4();
  let clientID = req.headers['client-id'];
  const rp = req.path;
  let apiName = rp.substr(rp.lastIndexOf('/') + 1);
  apiName = '/' + apiName;
  httpContext.set('ClientID', clientID);
  httpContext.set('ApiName', apiName);
  httpContext.set("ApiHash", ApiHash);
  next();
});

boot.default(app);
// const auth = require('./src/middlewares/auth/index')
// app.use(auth)
const routes = require('./src/controllers/routes');




const MOUNT_POINT = global.helper.config.MOUNT_POINT;
app.use(MOUNT_POINT, routes);

if(config.ENABLE_SWAGGER){
  // eslint-disable-next-line no-undef
  swaggerMiddleware(app);
}

app.use(function (req, res, next) {
  next({code: 404, msg: "API Not found."})
})
app.use(function (err, req, res, next) {
  log.error(functionName, "Error", err);
  let code = err.code || 500;
  res.status(code).json({
    success: false,
    msg: err.msg || err.message,
  });
})

process.on("uncaughtException", function(error) {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
})

process.on("unhandledRejection", function (error) {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
})


module.exports = app;

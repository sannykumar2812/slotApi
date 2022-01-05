/* eslint-disable indent */
const packages = require('../../../helpers');
const { axios } = packages.module;
const { AUTHENTICATION_ENDPOINT } = require('../../../config')
const { safePromise } = require("../../utilities");
const { SERVICE_NAME } = require('../../../constants')
 
async function auth(req, res, next) {
const bodyObj = {
body: {
      'authorization' : req.headers.authorization
}
}
const headerObj = {
headers : {
module : SERVICE_NAME
}
}
const [headerError] = await safePromise(axios.post(AUTHENTICATION_ENDPOINT, bodyObj.body, headerObj));
if(headerError){
return res.status(401).json({
message: "User is not authorized"
})
}
next();
}
module.exports = auth;
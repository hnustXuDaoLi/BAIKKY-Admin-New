import baseApi from './_baseApi';

const partnerLogin = async (username, password) => {
  const urlExt = '/login/partnerlogin';
  const requestBody = {
    LoginName: username,
    LoginPassword: password
  };
  const jsonPromise = baseApi(urlExt, 'POST', requestBody, null);
  const result = await jsonPromise.then(body => body.result || body.message);
  return result;
};

const userLogin = async (username, password) => {
  const urlExt = '/login/userlogin';
  const requestBody = {
    LoginName: username,
    LoginPassword: password
  };
  const jsonPromise = baseApi(urlExt, 'POST', requestBody, null);
  const result = await jsonPromise.then(body => body.result || body.message);
  return result;
};

const userLoginFacebook = async (requestBody) => {
  const urlExt = '/login/userloginFacebook';
  // generate special authorization header
  var bcrypt = require('bcryptjs');
  var salt = bcrypt.genSaltSync(10);
  var pass = "f2a0fff62092a336a98deec51d6134c8";
  var hash = bcrypt.hashSync(pass, salt);
  const headers = {
    Authorization: 'Bearer ' + hash
  };
  const jsonPromise = baseApi(urlExt, 'POST', requestBody, null, headers);
  const result = await jsonPromise.then(body => body.result || body.message);
  return result;
};

const userForgotPassword = async (UserEmail) => {
  const urlExt = '/user/forgotPassword';
  const requestBody = {UserEmail};
  const jsonPromise = baseApi(urlExt, 'POST', requestBody, null);
  return jsonPromise;
};

export default {
  partnerLogin,
  userLogin,
  userLoginFacebook,
  userForgotPassword
}
import baseApi from './_baseApi';
const baseEndpoint = '/user';

const register = async (requestBody) => {
  const urlExt = baseEndpoint + '/register';
  const jsonPromise = baseApi(urlExt, 'POST', requestBody, null);
  const result = await jsonPromise;
  return result;
};

const get = async (apiKey, requestBody) => {
  const urlExt = baseEndpoint + '/get';
  const headers = {
    Authorization: 'Bearer ' + apiKey
  };
  const jsonPromise = baseApi(urlExt, 'POST', requestBody, null, headers);
  const result = await jsonPromise;
  return result;
};

const getSelf = async (apiKey) => {
  const urlExt = baseEndpoint + '/getSelf';
  const headers = {
    Authorization: 'Bearer ' + apiKey
  };
  const jsonPromise = baseApi(urlExt, 'POST', null, null, headers);
  const result = await jsonPromise;
  return result;
};

const updateSelf = async (apiKey, requestBody) => {
  const urlExt = baseEndpoint + '/updateSelf';
  const headers = {
    Authorization: 'Bearer ' + apiKey
  };
  const jsonPromise = baseApi(urlExt, 'POST', requestBody, null, headers);
  const result = await jsonPromise;
  return result;
};

const forgotPassword = async (UserEmail) => {
  const urlExt = baseEndpoint + '/forgotPassword';
  const jsonPromise = baseApi(urlExt, 'POST', {UserEmail});
  const result = await jsonPromise;
  return result;
};

const verifyEmail = async (UserEmailVerifyCode) => {
  const urlExt = baseEndpoint + '/verifyEmail';
  const jsonPromise = baseApi(urlExt, 'POST', {UserEmailVerifyCode});
  const result = await jsonPromise;
  return result;
}

const deleteSelf = async (apiKey) => {
  const urlExt = baseEndpoint + '/deleteSelf';
  const headers = {
    Authorization: 'Bearer ' + apiKey
  };
  const jsonPromise = baseApi(urlExt, 'POST', null, null, headers);
  const result = await jsonPromise;
  return result;
};

export default {
  register, get, getSelf, updateSelf, 
  forgotPassword, verifyEmail, deleteSelf
}
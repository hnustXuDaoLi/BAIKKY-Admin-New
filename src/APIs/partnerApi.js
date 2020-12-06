import baseApi from './_baseApi';
const baseEndpoint = '/partner';

const signIn = async (requestBody) => {
  const urlExt = baseEndpoint + '/signIn';
  const jsonPromise = baseApi(urlExt, 'POST', requestBody, null);
  const result = await jsonPromise;
  return result;
};

const forgotPassword = async (UserEmail) => {
  const urlExt = baseEndpoint + '/forgotPassword';
  const jsonPromise = baseApi(urlExt, 'POST', {UserEmail});
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

const add = async (apiKey, requestBody) => {
  const urlExt = baseEndpoint + '/addNew';
  const headers = {
    Authorization: 'Bearer ' + apiKey
  };
  const jsonPromise = baseApi(urlExt, 'POST', requestBody, null, headers);
  const result = await jsonPromise;
  return result;
};

const update = async (apiKey, requestBody) => {
  const urlExt = baseEndpoint + '/update';
  const headers = {
    Authorization: 'Bearer ' + apiKey
  };
  const jsonPromise = baseApi(urlExt, 'POST', requestBody, null, headers);
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

const confirm = async (apiKey, idPartner, Confirm) => {
  const urlExt = baseEndpoint + '/confirm';
  const headers = {
    Authorization: 'Bearer ' + apiKey
  };
  const jsonPromise = baseApi(urlExt, 'POST', {idPartner, Confirm}, null, headers);
  const result = await jsonPromise;
  return result;
};

const suspend = async (apiKey, idPartner, Suspend) => {
  const urlExt = baseEndpoint + '/suspend';
  const headers = {
    Authorization: 'Bearer ' + apiKey
  };
  const jsonPromise = baseApi(urlExt, 'POST', {idPartner, Suspend}, null, headers);
  const result = await jsonPromise;
  return result;
};

const deletePartner = async (apiKey, idPartner) => {
  const urlExt = baseEndpoint + '/delete';
  const headers = {
    Authorization: 'Bearer ' + apiKey
  };
  const jsonPromise = baseApi(urlExt, 'POST', {idPartner}, null, headers);
  const result = await jsonPromise;
  return result;
};

const deleteSelf = async (apiKey) => {
  const urlExt = baseEndpoint + '/deleteSelf';
  const headers = {
    Authorization: 'Bearer ' + apiKey
  };
  const jsonPromise = baseApi(urlExt, 'POST', null, null, headers);
  const result = await jsonPromise;
  return result;
};

const verifyEmail = async (PartnerUserEmailVerifyCode) => {
  const urlExt = baseEndpoint + '/verifyEmail';
  const jsonPromise = baseApi(urlExt, 'POST', {PartnerUserEmailVerifyCode});
  const result = await jsonPromise;
  return result;
};

export default {
  signIn, forgotPassword, get, getSelf,
  add, update, updateSelf, confirm, suspend,
  delete:deletePartner, deleteSelf,
  verifyEmail
}
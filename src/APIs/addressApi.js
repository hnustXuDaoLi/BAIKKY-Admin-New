import baseApi from './_baseApi';
const baseEndpoint = '/address';

const getSelf = async (apiKey, requestBody) => {
  const urlExt = baseEndpoint + '/getSelf';
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

const setDefaultSelf = async (apiKey, idAddress) => {
  const urlExt = baseEndpoint + '/setDefaultSelf';
  const headers = {
    Authorization: 'Bearer ' + apiKey
  };
  const jsonPromise = baseApi(urlExt, 'POST', {idAddress}, null, headers);
  const result = await jsonPromise;
  return result;
};

export default {
  getSelf, updateSelf, setDefaultSelf
}
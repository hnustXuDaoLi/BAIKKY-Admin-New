import baseApi from './_baseApi';
const baseEndpoint = '/userDestinationRating';

const get = async () => {
  const urlExt = baseEndpoint + '/get';
  const jsonPromise = baseApi(urlExt, 'GET');
  const result = await jsonPromise;
  return result;
};

const deleteRating = async (apiKey, idUserDestinationRating) => {
  const urlExt = baseEndpoint + '/delete';
  const headers = {
    Authorization: 'Bearer ' + apiKey
  };
  const jsonPromise = baseApi(urlExt, 'POST', {idUserDestinationRating}, null, headers);
  const result = await jsonPromise;
  return result;
};

const getSelf = async (apiKey, requestBody) => {
  const urlExt = baseEndpoint + '/getSelf';
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

const add = async (apiKey, requestBody) => {
  const urlExt = baseEndpoint + '/add';
  const headers = {
    Authorization: 'Bearer ' + apiKey
  };
  const jsonPromise = baseApi(urlExt, 'POST', requestBody, null, headers);
  const result = await jsonPromise;
  return result;
};

export default {
  delete: deleteRating,
  get, getSelf, update, add
}
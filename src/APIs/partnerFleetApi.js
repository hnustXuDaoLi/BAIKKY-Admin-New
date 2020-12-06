import baseApi from './_baseApi';
const baseEndpoint = '/partnerFleet';

const get = async (requestBody) => {
  const urlExt = baseEndpoint + '/get';
  const jsonPromise = baseApi(urlExt, 'POST', requestBody);
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

const update = async (apiKey, requestBody) => {
  const urlExt = baseEndpoint + '/update';
  const headers = {
    Authorization: 'Bearer ' + apiKey
  };
  const jsonPromise = baseApi(urlExt, 'POST', requestBody, null, headers);
  const result = await jsonPromise;
  return result;
};

const deleteFleet = async (apiKey, idFleet) => {
  const urlExt = baseEndpoint + '/delete';
  const headers = {
    Authorization: 'Bearer ' + apiKey
  };
  const jsonPromise = baseApi(urlExt, 'POST', {idFleet}, null, headers);
  const result = await jsonPromise;
  return result;
};

export default {
  get, add, update,
  delete: deleteFleet
}
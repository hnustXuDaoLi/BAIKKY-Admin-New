import baseApi from './_baseApi';
const baseEndpoint = '/destination';

export default {
  destinationGet: (requestBody) => get(requestBody),
  destinationAdd: (apiKey, requestBody) => add(apiKey, requestBody),
  destinationUpdate: (apiKey, requestBody) => update(apiKey, requestBody),
  destinationDelete: (apiKey, requestBody) => destinationDelete(apiKey, requestBody),
}

async function get(requestBody) {
  const urlExt = baseEndpoint + '/get';
  const jsonPromise = baseApi(urlExt, 'POST', requestBody);
  const result = await jsonPromise;
  return result;
};

async function add(apiKey, requestBody) {
  const urlExt = baseEndpoint + '/add';
  const headers = {
    Authorization: 'Bearer ' + apiKey
  };
  const jsonPromise = baseApi(urlExt, 'POST', requestBody, null, headers);
  const result = await jsonPromise;
  return result;
};

async function update(apiKey, requestBody) {
  const urlExt = baseEndpoint + '/update';
  const headers = {
    Authorization: 'Bearer ' + apiKey
  };
  const jsonPromise = baseApi(urlExt, 'POST', requestBody, null, headers);
  const result = await jsonPromise;
  return result;
};

async function destinationDelete(apiKey, requestBody) {
  const urlExt = baseEndpoint + '/delete';
  const headers = {
    Authorization: 'Bearer ' + apiKey
  };
  const jsonPromise = baseApi(urlExt, 'POST', requestBody, null, headers);
  const result = await jsonPromise;
  return result;
};
import baseApi from './_baseApi';
const baseEndpoint = '/userBookingFleet';

const get = async (apiKey, requestBody) => {
  const urlExt = baseEndpoint + '/get';
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

const update = async (apiKey, requestBody) => {
  const urlExt = baseEndpoint + '/update';
  const headers = {
    Authorization: 'Bearer ' + apiKey
  };
  const jsonPromise = baseApi(urlExt, 'POST', requestBody, null, headers);
  const result = await jsonPromise;
  return result;
};

const deleteUserBookingFleet = async (apiKey, idBookingFleet) => {
  const urlExt = baseEndpoint + '/delete';
  const headers = {
    Authorization: 'Bearer ' + apiKey
  };
  const jsonPromise = baseApi(urlExt, 'POST', {idBookingFleet}, null, headers);
  const result = await jsonPromise;
  return result;
};

export default {
  get, add, update, "delete":deleteUserBookingFleet
}
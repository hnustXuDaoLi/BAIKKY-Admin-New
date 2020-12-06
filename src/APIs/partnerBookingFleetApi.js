import baseApi from './_baseApi';
const baseEndpoint = '/partnerBookingFleet';

const get = async (apiKey, requestBody) => {
  const urlExt = baseEndpoint + '/get';
  const headers = {
    Authorization: 'Bearer ' + apiKey
  };
  const jsonPromise = baseApi(urlExt, 'POST', requestBody, null, headers);
  const result = await jsonPromise;
  return result;
};

export default {
  get
}
import baseApi from './_baseApi';
const baseEndpoint = '/search';

const getPartner = async (requestBody) => {
  const urlExt = baseEndpoint + '/getPartner';
  const jsonPromise = baseApi(urlExt, 'POST', requestBody, null);
  const result = await jsonPromise;
  return result;
};

export default {
  getPartner
}
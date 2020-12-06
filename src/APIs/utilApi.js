import baseApi from './_baseApi';
const baseEndpoint = '/util';

const getFleetType = async () => {
  const urlExt = baseEndpoint + '/getFleetType';
  const jsonPromise = baseApi(urlExt, 'GET');
  const result = await jsonPromise;
  return result;
};

const getCountryCode = async () => {
  const urlExt = baseEndpoint + '/getCountryCode';
  const jsonPromise = baseApi(urlExt, 'GET');
  const result = await jsonPromise;
  return result;
};

export default {
  getFleetType, getCountryCode
}
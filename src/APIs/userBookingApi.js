import baseApi from './_baseApi';
const baseEndpoint = '/userBooking';

export default {
  userBookingGet: (apiKey, requestBody) => get(apiKey, requestBody),
  userBookingAdd: (apiKey, requestBody) => add(apiKey, requestBody),
  userBookingUpdate: (apiKey, requestBody) => update(apiKey, requestBody),
  userBookingDelete: (apiKey, idBooking) => userBookingDelete(apiKey, idBooking),
  userBookingConfirm: (apiKey, idBooking) => confirm(apiKey, idBooking),
  userBookingAccept: (apiKey, idBooking, BookingStatus) => accept(apiKey, idBooking, BookingStatus),
}

async function get(apiKey, requestBody) {
  const urlExt = baseEndpoint + '/get';
  const headers = {
    Authorization: 'Bearer ' + apiKey
  };
  const jsonPromise = baseApi(urlExt, 'POST', requestBody, null, headers);
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

async function userBookingDelete(apiKey, idBooking) {
  const urlExt = baseEndpoint + '/delete';
  const headers = {
    Authorization: 'Bearer ' + apiKey
  };
  const jsonPromise = baseApi(urlExt, 'POST', {idBooking}, null, headers);
  const result = await jsonPromise;
  return result;
};

async function confirm(apiKey, idBooking) {
  const urlExt = baseEndpoint + '/confirm';
  const headers = {
    Authorization: 'Bearer ' + apiKey
  };
  const jsonPromise = baseApi(urlExt, 'POST', {idBooking}, null, headers);
  const result = await jsonPromise;
  return result;
};

async function accept(apiKey, idBooking, BookingStatus) {
  const urlExt = baseEndpoint + '/accept';
  const headers = {
    Authorization: 'Bearer ' + apiKey
  };
  const jsonPromise = baseApi(urlExt, 'POST', {idBooking, BookingStatus}, null, headers);
  const result = await jsonPromise;
  return result;
};
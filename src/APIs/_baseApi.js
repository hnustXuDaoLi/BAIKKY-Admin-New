const ApiHost = 'https://webdev.mybaikky.com/api/v0'

/**
 * 
 * @param {string} urlExt 
 * @param {string} method 
 * @param {string} body 
 * @param {string} [apiHost]
 * @param {} [headers]
 */
export default function baseApi(urlExt, method, body, apiHost, headers) {
  const url = (apiHost || ApiHost) + urlExt;
  const jsonPromise = fetch(url, {
    method: method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      ...headers
    },
    body: JSON.stringify(body)
  }).then(response => response.json());
  return jsonPromise;
}
import axios from "axios";
import momentTz from "moment-timezone";

// Token utilities
export const AccessToken = {
  get: () => localStorage.getItem("token"),
  set: (token) => localStorage.setItem("token", token),
  remove: () => localStorage.removeItem("token"),
};

// Axios instance
const instance = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  timeout: 90000,
  responseType: "json",
});

// Set auth token in default headers
const setAuthHeader = () => {
  const token = AccessToken.get();
  if (token) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

// Generate headers dynamically based on data type
const getHeaders = (data) => {
  const headers = {
    tz: momentTz.tz.guess(),
  };

  if (!(data instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
};

// HTTP Methods
const get = (url, params = {}) => {
  setAuthHeader();
  return instance.get(url, params);
};

const post = (url, data) => {
  setAuthHeader();
  return instance.post(url, data, { headers: getHeaders(data) });
};

const put = (url, data) => {
  setAuthHeader();
  return instance.put(url, data, { headers: getHeaders(data) });
};

const patch = (url, data) => {
  setAuthHeader();
  return instance.patch(url, data, { headers: getHeaders(data) });
};

const del = (url, data) => {
  setAuthHeader();
  return instance.delete(url, { data, headers: getHeaders(data) });
};

// Export
export default { instance, get, post, put, patch, del };
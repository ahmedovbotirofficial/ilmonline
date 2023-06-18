import jwt_decode from 'jwt-decode';
import axios from 'axios';
import store from '@/store';
import router from '@/router';
import { setToLS, getFromLS, isLSHasItem } from '@/library/helpers';

// const getHeader = (loc = 'ru') => {
//   const header = (Axios.defaults.headers.common['Locale'] = loc);
//   return header;
// };

export const checkUserToken = () => {
  const token = JSON.parse(localStorage.getItem('token'));
  if (token) {
    try {
      const decoded = jwt_decode(token);

      return Date.now() >= decoded.exp * 1000 ? false : token;
    } catch (e) {}
  }

  return false;
};
const authInterceptor = (config) => {
  const token = checkUserToken();
  config.headers.common['Locale'] = getFromLS('multi_lang' || 'uz-latn');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    store.commit('LOGOUT_USER');
  }

  return config;
};

const config = {
  baseURL: process.env.VUE_APP_API_HOST,
  timeout: 60 * 1000, // Timeout
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    // 'Locale': getFromLS('multi_lang') || 'ru',
    // 'Access-Control-Max-Age': '21600',
    // 'Cache-Control': '21600',
    // 'Content-type': 'media',
    // 'Access-Control-Allow-Headers': 'Content-type, Accept',
    // Accept: '/',
  },
};
const Axios = axios.create(config);

const errorComposer = (error) => {
  const statusCode = error.response ? error.response.status : null;
  // console.log('error composer statusCode <<<<<<<', statusCode);

  if (statusCode === 401) {
    store.commit('LOGOUT_USER');
    router.push({ name: 'sign' });
    store.dispatch('setNotification', {
      type: 'warning',
      text: `${error.response.data.message} ${statusCode}`,
    });
    return;
  }
};

// const token = checkUserToken();
// if (token) {
Axios.interceptors.request.use(authInterceptor);
// }

Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    error.handleGlobally = errorComposer(error);
    return Promise.reject(error);
  }
);

export { Axios };

import axios from 'axios';
import Cookies from 'js-cookie';
import Router from 'next/router';
import { message } from 'antd';

axios.interceptors.response.use(
  response => response,
  error => {
    if (error?.response?.status === 401) {
      Cookies.remove('token');
      Cookies.remove('isAdmin');
      Cookies.remove('username');
      Router.push('/login');
      message.warning('Se ha cerrado sesión por inactividad');
    }
    return Promise.reject(error);
  }
);

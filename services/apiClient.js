import axios from 'axios';
import loadingService from './loadingService';

const BASE_URL = 'https://portfolio-backend-fsqx.onrender.com';
// const BASE_URL = 'http://localhost:8080';

// Create axios instance
const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Attach JWT Token
apiClient.interceptors.request.use(
  (config) => {
    loadingService.increment();
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('jwt_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    loadingService.decrement();
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle Errors
apiClient.interceptors.response.use(
  (response) => {
    loadingService.decrement();
    return response;
  },
  (error) => {
    loadingService.decrement();
    if (error.response) {
      const { status } = error.response;

      // Handle Unauthorized
      if (status === 401 || status === 403) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('jwt_token');
          // Redirect to login if not already there
          if (window.location.pathname !== '/login') {
            window.location.href = '/login';
          }
        }
      }

      // Handle Render Sleep (Service Unavailable)
      if (status === 503) {
        console.error('Backend service is sleeping. Please try again in a moment.');
      }

      // Log error details
      console.error(`API Error [${status}]:`, error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Request setup error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default apiClient;

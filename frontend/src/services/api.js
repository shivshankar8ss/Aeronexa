import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Response interceptor for global error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || 'Something went wrong.';
    if (err.response?.status === 401) {
      localStorage.removeItem('aeronexa_token');
      window.location.href = '/login';
    } else if (err.response?.status >= 500) {
      toast.error('Server error. Please try again.');
    }
    return Promise.reject({ ...err, message });
  }
);

export default api;

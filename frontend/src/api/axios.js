import axios from 'axios';

const api = axios.create({
  baseURL: 'http://15.135.194.34:5001/api',
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('recipeUser') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;

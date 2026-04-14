import axios from 'axios';

const api = axios.create({
  baseURL: 'http://3.107.79.158:5001/api',
});

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('recipeUser') || 'null');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

export default api;

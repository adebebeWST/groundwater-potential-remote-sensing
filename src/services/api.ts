import axios from 'axios';

const baseURL = process.env.URL;

const api = axios.create({
  baseURL,
});

export default api;

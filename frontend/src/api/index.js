import axios from './axiosInstance';
import { API_ENDPOINTS } from './endpoints';

export const productApi = {
  getAll: () => axios.get(API_ENDPOINTS.PRODUCTS),
  getOne: (id) => axios.get(API_ENDPOINTS.PRODUCT_BY_ID(id)),
  create: (data) => axios.post(API_ENDPOINTS.PRODUCTS, data),
  update: (id, data) => axios.put(API_ENDPOINTS.PRODUCT_BY_ID(id), data),
  delete: (id) => axios.delete(API_ENDPOINTS.PRODUCT_BY_ID(id)),
};

export const mediaApi = {
  getAll: () => axios.get(API_ENDPOINTS.MEDIA),
  delete: (id) => axios.delete(API_ENDPOINTS.MEDIA_BY_ID(id)),
};

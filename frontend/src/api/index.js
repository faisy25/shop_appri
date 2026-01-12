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

// RBA APIs
export const organizationApi = {
  getAll: () => axios.get(API_ENDPOINTS.ORGANIZATIONS),
  getOne: (id) => axios.get(API_ENDPOINTS.ORGANIZATION_BY_ID(id)),
  create: (data) => axios.post(API_ENDPOINTS.ORGANIZATIONS, data),
  update: (id, data) => axios.put(API_ENDPOINTS.ORGANIZATION_BY_ID(id), data),
  delete: (id) => axios.delete(API_ENDPOINTS.ORGANIZATION_BY_ID(id)),
};

export const departmentApi = {
  getAll: () => axios.get(API_ENDPOINTS.DEPARTMENTS),
  getOne: (id) => axios.get(API_ENDPOINTS.DEPARTMENT_BY_ID(id)),
  create: (data) => axios.post(API_ENDPOINTS.DEPARTMENTS, data),
  update: (id, data) => axios.put(API_ENDPOINTS.DEPARTMENT_BY_ID(id), data),
  delete: (id) => axios.delete(API_ENDPOINTS.DEPARTMENT_BY_ID(id)),
};

export const designationApi = {
  getAll: () => axios.get(API_ENDPOINTS.DESIGNATIONS),
  getOne: (id) => axios.get(API_ENDPOINTS.DESIGNATION_BY_ID(id)),
  create: (data) => axios.post(API_ENDPOINTS.DESIGNATIONS, data),
  update: (id, data) => axios.put(API_ENDPOINTS.DESIGNATION_BY_ID(id), data),
  delete: (id) => axios.delete(API_ENDPOINTS.DESIGNATION_BY_ID(id)),
};

export const featureApi = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.element_type) params.append('element_type', filters.element_type);
    if (filters.parent_id !== undefined && filters.parent_id !== null && filters.parent_id !== '') {
      params.append('parent_id', filters.parent_id);
    }
    const queryString = params.toString();
    return axios.get(
      queryString ? `${API_ENDPOINTS.FEATURES}?${queryString}` : API_ENDPOINTS.FEATURES,
    );
  },
  getOne: (id) => axios.get(API_ENDPOINTS.FEATURE_BY_ID(id)),
  create: (data) => axios.post(API_ENDPOINTS.FEATURES, data),
  update: (id, data) => axios.put(API_ENDPOINTS.FEATURE_BY_ID(id), data),
  delete: (id) => axios.delete(API_ENDPOINTS.FEATURE_BY_ID(id)),
};

export const permissionApi = {
  getAll: () => axios.get(API_ENDPOINTS.PERMISSIONS),
  getOne: (id) => axios.get(API_ENDPOINTS.PERMISSION_BY_ID(id)),
  create: (data) => axios.post(API_ENDPOINTS.PERMISSIONS, data),
  update: (id, data) => axios.put(API_ENDPOINTS.PERMISSION_BY_ID(id), data),
  delete: (id) => axios.delete(API_ENDPOINTS.PERMISSION_BY_ID(id)),
};

export const roleApi = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.organization_id) params.append('organization_id', filters.organization_id);
    if (filters.department_id) params.append('department_id', filters.department_id);
    if (filters.designation_id) params.append('designation_id', filters.designation_id);
    const queryString = params.toString();
    return axios.get(queryString ? `${API_ENDPOINTS.ROLES}?${queryString}` : API_ENDPOINTS.ROLES);
  },
  getOne: (id) => axios.get(API_ENDPOINTS.ROLE_BY_ID(id)),
  create: (data) => axios.post(API_ENDPOINTS.ROLES, data),
  update: (id, data) => axios.put(API_ENDPOINTS.ROLE_BY_ID(id), data),
  delete: (id) => axios.delete(API_ENDPOINTS.ROLE_BY_ID(id)),
};

export const userApi = {
  getAll: () => axios.get(API_ENDPOINTS.USERS),
  getOne: (id) => axios.get(API_ENDPOINTS.USER_BY_ID(id)),
  create: (data) => axios.post(API_ENDPOINTS.USERS, data),
  update: (id, data) => axios.put(API_ENDPOINTS.USER_BY_ID(id), data),
  delete: (id) => axios.delete(API_ENDPOINTS.USER_BY_ID(id)),
};

export const roleFeaturePermissionApi = {
  getByRole: (roleId) => axios.get(API_ENDPOINTS.ROLE_FEATURE_PERMISSION_BY_ROLE(roleId)),
  bulkAssign: (roleId, data) =>
    axios.post(API_ENDPOINTS.ROLE_FEATURE_PERMISSION_BULK_ASSIGN(roleId), data),
  bulkRemove: (roleId, data) =>
    axios.post(API_ENDPOINTS.ROLE_FEATURE_PERMISSION_BULK_REMOVE(roleId), data),
};

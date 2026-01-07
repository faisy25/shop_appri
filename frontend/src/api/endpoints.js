export const API_ENDPOINTS = {
  PRODUCTS: '/products',
  PRODUCT_BY_ID: (id) => `/products/${id}`,

  MEDIA: '/media',
  MEDIA_BY_ID: (id) => `/media/${id}`,

  // RBA Endpoints
  ORGANIZATIONS: '/organization',
  ORGANIZATION_BY_ID: (id) => `/organization/${id}`,

  DEPARTMENTS: '/department',
  DEPARTMENT_BY_ID: (id) => `/department/${id}`,

  DESIGNATIONS: '/designation',
  DESIGNATION_BY_ID: (id) => `/designation/${id}`,

  FEATURES: '/feature',
  FEATURE_BY_ID: (id) => `/feature/${id}`,

  PERMISSIONS: '/permission',
  PERMISSION_BY_ID: (id) => `/permission/${id}`,

  ROLES: '/role',
  ROLE_BY_ID: (id) => `/role/${id}`,

  USERS: '/user',
  USER_BY_ID: (id) => `/user/${id}`,
};

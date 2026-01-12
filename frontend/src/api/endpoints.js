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

  ROLE_FEATURE_PERMISSIONS: '/role-feature-permission',
  ROLE_FEATURE_PERMISSION_BY_ROLE: (roleId) => `/role-feature-permission/role/${roleId}`,
  ROLE_FEATURE_PERMISSION_BY_USER: (userId) => `/role-feature-permission/user/${userId}`,
  ROLE_FEATURE_PERMISSION_BULK_ASSIGN: (roleId) =>
    `/role-feature-permission/role/${roleId}/bulk-assign`,
  ROLE_FEATURE_PERMISSION_BULK_REMOVE: (roleId) =>
    `/role-feature-permission/role/${roleId}/bulk-remove`,
};

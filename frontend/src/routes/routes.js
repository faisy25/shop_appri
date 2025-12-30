// This are the react applications routes

export const ROUTES = {
  HOME: '/',

  PRODUCT: {
    ROOT: '/product',
    ADD_FORM: '/product/add',
    EDIT_FORM: (id) => `/product/edit/${id}`,
    VIEW: (id) => `/product/view/${id}`,
  },

  INVENTORY: {
    ROOT: '/inventory',
  },

  // RBA Routes
  RBA: {
    ROOT: '/rba',
    ORGANIZATION: {
      ROOT: '/rba/organization',
      ADD_FORM: '/rba/organization/add',
      EDIT_FORM: (id) => `/rba/organization/edit/${id}`,
      VIEW: (id) => `/rba/organization/view/${id}`,
    },
    DEPARTMENT: {
      ROOT: '/rba/department',
      ADD_FORM: '/rba/department/add',
      EDIT_FORM: (id) => `/rba/department/edit/${id}`,
      VIEW: (id) => `/rba/department/view/${id}`,
    },
    DESIGNATION: {
      ROOT: '/rba/designation',
      ADD_FORM: '/rba/designation/add',
      EDIT_FORM: (id) => `/rba/designation/edit/${id}`,
      VIEW: (id) => `/rba/designation/view/${id}`,
    },
    FEATURE: {
      ROOT: '/rba/feature',
      ADD_FORM: '/rba/feature/add',
      EDIT_FORM: (id) => `/rba/feature/edit/${id}`,
      VIEW: (id) => `/rba/feature/view/${id}`,
    },
    PERMISSION: {
      ROOT: '/rba/permission',
      ADD_FORM: '/rba/permission/add',
      EDIT_FORM: (id) => `/rba/permission/edit/${id}`,
      VIEW: (id) => `/rba/permission/view/${id}`,
    },
    ROLE: {
      ROOT: '/rba/role',
      ADD_FORM: '/rba/role/add',
      EDIT_FORM: (id) => `/rba/role/edit/${id}`,
      VIEW: (id) => `/rba/role/view/${id}`,
    },
  },
};

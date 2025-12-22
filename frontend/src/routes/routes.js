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
    ROOT: 'inventory',
  },
};

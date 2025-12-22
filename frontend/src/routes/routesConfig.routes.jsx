import { lazy } from 'react';
import { ROUTES } from './routes';

import HomePage from '../pages/HomePage';

// Product
const ProductPage = lazy(() => import('../pages/product/ProductPage'));
const ProductListPage = lazy(() => import('../pages/product/ProductListPage'));
const ProductFormPage = lazy(() => import('../pages/product/ProductFormPage'));
const ProductViewPage = lazy(() => import('../pages/product/ProductViewPage'));

export const routeConfig = [
  // HOME
  {
    path: ROUTES.HOME,
    element: <HomePage />,
    label: 'Home',
    showInMenu: false,
  },
  // PRODUCT
  {
    path: ROUTES.PRODUCT.ROOT,
    element: <ProductPage />,
    label: 'Products',
    showInMenu: true,
    children: [
      {
        index: true,
        path: ROUTES.PRODUCT.ROOT,
        element: <ProductListPage />,
        showInMenu: false,
      },
      {
        path: ROUTES.PRODUCT.ADD_FORM,
        element: <ProductFormPage />,
        showInMenu: false,
      },
      {
        path: ROUTES.PRODUCT.EDIT_FORM(':id'),
        element: <ProductFormPage />,
        showInMenu: false,
      },
      {
        path: ROUTES.PRODUCT.VIEW(':id'),
        element: <ProductViewPage />,
        showInMenu: false,
      },
    ],
  },
  // INVENTORY
  {
    path: ROUTES.INVENTORY.ROOT,
    element: null, // No page yet
    label: 'Inventory',
    showInMenu: true,
  },
];

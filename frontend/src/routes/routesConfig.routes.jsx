import { lazy } from 'react';
import { ROUTES } from './routes';
import {
  ShoppingBag,
  Inventory,
  Business,
  AccountTree,
  Work,
  Category,
  Security,
  Groups,
  HomeFilled,
  Dashboard,
  People,
} from '@mui/icons-material';

import HomePage from '../pages/HomePage';

// Product
const ProductPage = lazy(() => import('../pages/product/ProductPage'));
const ProductListPage = lazy(() => import('../pages/product/ProductListPage'));
const ProductFormPage = lazy(() => import('../pages/product/ProductFormPage'));
const ProductViewPage = lazy(() => import('../pages/product/ProductViewPage'));

// RBA Modules
const OrganizationPage = lazy(() => import('../pages/rba/organization/OrganizationPage'));
const OrganizationListPage = lazy(() => import('../pages/rba/organization/OrganizationListPage'));
const OrganizationFormPage = lazy(() => import('../pages/rba/organization/OrganizationFormPage'));

const DepartmentPage = lazy(() => import('../pages/rba/department/DepartmentPage'));
const DepartmentListPage = lazy(() => import('../pages/rba/department/DepartmentListPage'));
const DepartmentFormPage = lazy(() => import('../pages/rba/department/DepartmentFormPage'));

const DesignationPage = lazy(() => import('../pages/rba/designation/DesignationPage'));
const DesignationListPage = lazy(() => import('../pages/rba/designation/DesignationListPage'));
const DesignationFormPage = lazy(() => import('../pages/rba/designation/DesignationFormPage'));

const FeaturePage = lazy(() => import('../pages/rba/feature/FeaturePage'));
const FeatureListPage = lazy(() => import('../pages/rba/feature/FeatureListPage'));
const FeatureFormPage = lazy(() => import('../pages/rba/feature/FeatureFormPage'));

const PermissionPage = lazy(() => import('../pages/rba/permission/PermissionPage'));
const PermissionListPage = lazy(() => import('../pages/rba/permission/PermissionListPage'));
const PermissionFormPage = lazy(() => import('../pages/rba/permission/PermissionFormPage'));

const RolePage = lazy(() => import('../pages/rba/role/RolePage'));
const RoleListPage = lazy(() => import('../pages/rba/role/RoleListPage'));
const RoleFormPage = lazy(() => import('../pages/rba/role/RoleFormPage'));

// Menu Groups Configuration - Define groups once with their icons
export const menuGroups = {
  DASHBOARD: {
    icon: Dashboard,
  },
  INVENTORY: {
    icon: ShoppingBag,
  },
  'USER MANAGEMENT': {
    icon: People,
  },
};

export const routeConfig = [
  // HOME
  {
    path: ROUTES.HOME,
    element: <HomePage />,
    label: 'Home',
    showInMenu: true,
    menuGroup: 'DASHBOARD',
    icon: HomeFilled,
    children: [],
  },
  // PRODUCT
  {
    path: ROUTES.PRODUCT.ROOT,
    element: <ProductPage />,
    label: 'Products',
    showInMenu: true,
    menuGroup: 'INVENTORY',
    icon: ShoppingBag,
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
    icon: Inventory,
    menuGroup: 'INVENTORY',
    children: [],
  },

  // RBA Modules - Organization
  {
    path: ROUTES.RBA.ORGANIZATION.ROOT,
    element: <OrganizationPage />,
    label: 'Organization',
    showInMenu: true,
    menuGroup: 'USER MANAGEMENT',
    icon: Business,
    children: [
      {
        index: true,
        path: ROUTES.RBA.ORGANIZATION.ROOT,
        element: <OrganizationListPage />,
        showInMenu: false,
      },
      {
        path: ROUTES.RBA.ORGANIZATION.ADD_FORM,
        element: <OrganizationFormPage />,
        showInMenu: false,
      },
      {
        path: ROUTES.RBA.ORGANIZATION.EDIT_FORM(':id'),
        element: <OrganizationFormPage />,
        showInMenu: false,
      },
    ],
  },
  // RBA Modules - Department
  {
    path: ROUTES.RBA.DEPARTMENT.ROOT,
    element: <DepartmentPage />,
    label: 'Department',
    showInMenu: true,
    menuGroup: 'USER MANAGEMENT',
    icon: AccountTree, // Icon for Department submenu item
    children: [
      {
        index: true,
        path: ROUTES.RBA.DEPARTMENT.ROOT,
        element: <DepartmentListPage />,
        showInMenu: false,
      },
      {
        path: ROUTES.RBA.DEPARTMENT.ADD_FORM,
        element: <DepartmentFormPage />,
        showInMenu: false,
      },
      {
        path: ROUTES.RBA.DEPARTMENT.EDIT_FORM(':id'),
        element: <DepartmentFormPage />,
        showInMenu: false,
      },
    ],
  },
  // RBA Modules - Designation
  {
    path: ROUTES.RBA.DESIGNATION.ROOT,
    element: <DesignationPage />,
    label: 'Designation',
    showInMenu: true,
    menuGroup: 'USER MANAGEMENT',
    icon: Work, // Icon for Designation submenu item
    children: [
      {
        index: true,
        path: ROUTES.RBA.DESIGNATION.ROOT,
        element: <DesignationListPage />,
        showInMenu: false,
      },
      {
        path: ROUTES.RBA.DESIGNATION.ADD_FORM,
        element: <DesignationFormPage />,
        showInMenu: false,
      },
      {
        path: ROUTES.RBA.DESIGNATION.EDIT_FORM(':id'),
        element: <DesignationFormPage />,
        showInMenu: false,
      },
    ],
  },
  // RBA Modules - Feature
  {
    path: ROUTES.RBA.FEATURE.ROOT,
    element: <FeaturePage />,
    label: 'Feature',
    showInMenu: true,
    menuGroup: 'USER MANAGEMENT',
    icon: Category, // Icon for Feature submenu item
    children: [
      {
        index: true,
        path: ROUTES.RBA.FEATURE.ROOT,
        element: <FeatureListPage />,
        showInMenu: false,
      },
      {
        path: ROUTES.RBA.FEATURE.ADD_FORM,
        element: <FeatureFormPage />,
        showInMenu: false,
      },
      {
        path: ROUTES.RBA.FEATURE.EDIT_FORM(':id'),
        element: <FeatureFormPage />,
        showInMenu: false,
      },
    ],
  },
  // RBA Modules - Permission
  {
    path: ROUTES.RBA.PERMISSION.ROOT,
    element: <PermissionPage />,
    label: 'Permission',
    showInMenu: true,
    menuGroup: 'USER MANAGEMENT',
    icon: Security, // Icon for Permission submenu item
    children: [
      {
        index: true,
        path: ROUTES.RBA.PERMISSION.ROOT,
        element: <PermissionListPage />,
        showInMenu: false,
      },
      {
        path: ROUTES.RBA.PERMISSION.ADD_FORM,
        element: <PermissionFormPage />,
        showInMenu: false,
      },
      {
        path: ROUTES.RBA.PERMISSION.EDIT_FORM(':id'),
        element: <PermissionFormPage />,
        showInMenu: false,
      },
    ],
  },
  // RBA Modules - Role
  {
    path: ROUTES.RBA.ROLE.ROOT,
    element: <RolePage />,
    label: 'Role',
    showInMenu: true,
    menuGroup: 'USER MANAGEMENT',
    icon: Groups, // Icon for Role submenu item
    children: [
      {
        index: true,
        path: ROUTES.RBA.ROLE.ROOT,
        element: <RoleListPage />,
        showInMenu: false,
      },
      {
        path: ROUTES.RBA.ROLE.ADD_FORM,
        element: <RoleFormPage />,
        showInMenu: false,
      },
      {
        path: ROUTES.RBA.ROLE.EDIT_FORM(':id'),
        element: <RoleFormPage />,
        showInMenu: false,
      },
    ],
  },
];

/**
 * RBA (Role-Based Access Control) Enums and Options
 *
 * This file contains all enum values and dropdown options for RBA-related forms.
 *
 * Usage:
 *   import { ORGANIZATION_TYPES } from '@/constants';
 *   or
 *   import { ORGANIZATION_TYPES } from '@/constants/rba/enums';
 */

/**
 * Organization Type Options
 * Used in OrganizationFormPage for the type dropdown
 */
export const ORGANIZATION_TYPES = [
  { label: 'Internal', value: 'internal' },
  { label: 'Brand', value: 'brand' },
  { label: 'Outsourced', value: 'outsourced' },
];

/**
 * Organization Type Values (for validation/type checking)
 */
export const ORGANIZATION_TYPE_VALUES = {
  INTERNAL: 'internal',
  BRAND: 'brand',
  OUTSOURCED: 'outsourced',
};

/**
 * Feature Element Type Options
 * Used in FeatureFormPage for the element_type dropdown
 */
export const FEATURE_ELEMENT_TYPES = [
  { label: 'Menu', value: 'menu' },
  { label: 'Group', value: 'group' },
  { label: 'Page', value: 'page' },
  { label: 'Button', value: 'button' },
  { label: 'Link', value: 'link' },
];

/**
 * Feature Element Type Values (for validation/type checking)
 */
export const FEATURE_ELEMENT_TYPE_VALUES = {
  MENU: 'menu',
  GROUP: 'group',
  PAGE: 'page',
  BUTTON: 'button',
  LINK: 'link',
};

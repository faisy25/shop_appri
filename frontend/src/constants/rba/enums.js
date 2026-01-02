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

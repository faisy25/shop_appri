import j2s from 'joi-to-swagger';
import {
  createOrganizationSchema,
  editOrganizationSchema,
  organizationIdSchema,
  organizationSchema,
} from './organization.validation.js';

// Swagger schema exports
export const { swagger: organizationSchemaSwagger } = j2s(organizationSchema);
export const { swagger: organizationIdSchemaSwagger } = j2s(organizationIdSchema);
export const { swagger: createOrganizationSchemaSwagger } = j2s(createOrganizationSchema);
export const { swagger: editOrganizationSchemaSwagger } = j2s(editOrganizationSchema);


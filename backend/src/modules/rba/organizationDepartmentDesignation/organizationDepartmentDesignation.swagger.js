import j2s from 'joi-to-swagger';
import {
  createOrganizationDepartmentDesignationSchema,
  editOrganizationDepartmentDesignationSchema,
  organizationDepartmentDesignationIdSchema,
  organizationDepartmentDesignationSchema,
} from './organizationDepartmentDesignation.validation.js';

// Swagger schema exports
export const { swagger: organizationDepartmentDesignationSchemaSwagger } = j2s(
  organizationDepartmentDesignationSchema,
);
export const { swagger: organizationDepartmentDesignationIdSchemaSwagger } = j2s(
  organizationDepartmentDesignationIdSchema,
);
export const { swagger: createOrganizationDepartmentDesignationSchemaSwagger } = j2s(
  createOrganizationDepartmentDesignationSchema,
);
export const { swagger: editOrganizationDepartmentDesignationSchemaSwagger } = j2s(
  editOrganizationDepartmentDesignationSchema,
);


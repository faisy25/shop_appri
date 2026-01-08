import j2s from 'joi-to-swagger';
import { makeGet, makePost, makePut, makeDelete } from '../../../config/docs/method.swagger.js';
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

// For redoc documentation
const tag = 'Organization';
export const organizationPaths = {
  '/organizations': {
    get: makeGet(tag, 'Get all organizations', organizationSchemaSwagger, true),
    post: makePost(
      tag,
      'Create organization',
      createOrganizationSchemaSwagger,
      organizationIdSchemaSwagger,
    ),
  },

  '/organizations/{id}': {
    get: makeGet(tag, 'Get organization', organizationSchemaSwagger),
    put: makePut(
      tag,
      'Update organization',
      editOrganizationSchemaSwagger,
      organizationIdSchemaSwagger,
    ),
    delete: makeDelete(tag, 'Delete organization', organizationIdSchemaSwagger),
  },

  '/organizations/hard/{id}': {
    delete: makeDelete(tag, 'Delete organization permanently', organizationIdSchemaSwagger),
  },
};


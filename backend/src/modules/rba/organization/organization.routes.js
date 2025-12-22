import { Router } from 'express';
import {
  createOrganization,
  deleteOrganization,
  getOrganization,
  getOrganizationDelete,
  getOrganizations,
  hardDeleteOrganization,
  updateOrganization,
  getOrganizationsWithDeleted,
} from './organization.controller.js';
import { validate } from '../../middleware/validate.middleware.js';
import { createOrganizationSchema, editOrganizationSchema } from './organization.validation.js';

const router = Router();

router.get('/', getOrganizations);
router.post('/', validate(createOrganizationSchema), createOrganization);

router.get('/hard', getOrganizationsWithDeleted);
router.delete('/hard/:id', hardDeleteOrganization);
router.get('/hard/:id', getOrganizationDelete);

router.get('/:id', getOrganization);
router.put('/:id', validate(editOrganizationSchema), updateOrganization);
router.delete('/:id', deleteOrganization);

export default router;

// For redoc documentation
import { makeGet, makePost, makePut, makeDelete } from '../../config/docs/method.swagger.js';
import {
  organizationSchemaSwagger,
  createOrganizationSchemaSwagger,
  editOrganizationSchemaSwagger,
  organizationIdSchemaSwagger,
} from './organization.validation.js';

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

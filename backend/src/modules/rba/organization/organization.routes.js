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
import { validate } from '../../../middleware/validate.middleware.js';
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

// Export paths from swagger file
export { organizationPaths } from './organization.swagger.js';

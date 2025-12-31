import { Router } from 'express';
import {
  createOrganizationDepartmentDesignation,
  deleteOrganizationDepartmentDesignation,
  getOrganizationDepartmentDesignation,
  getOrganizationDepartmentDesignationDelete,
  getOrganizationDepartmentDesignations,
  hardDeleteOrganizationDepartmentDesignation,
  updateOrganizationDepartmentDesignation,
  getOrganizationDepartmentDesignationsWithDeleted,
} from './organizationDepartmentDesignation.controller.js';
import { validate } from '../../../middleware/validate.middleware.js';
import {
  createOrganizationDepartmentDesignationSchema,
  editOrganizationDepartmentDesignationSchema,
} from './organizationDepartmentDesignation.validation.js';

const router = Router();

router.get('/', getOrganizationDepartmentDesignations);
router.post(
  '/',
  validate(createOrganizationDepartmentDesignationSchema),
  createOrganizationDepartmentDesignation,
);

router.get('/hard', getOrganizationDepartmentDesignationsWithDeleted);
router.delete(
  '/hard/:organizationId/:departmentId/:designationId',
  hardDeleteOrganizationDepartmentDesignation,
);
router.get(
  '/hard/:organizationId/:departmentId/:designationId',
  getOrganizationDepartmentDesignationDelete,
);

router.get('/:organizationId/:departmentId/:designationId', getOrganizationDepartmentDesignation);
router.put(
  '/:organizationId/:departmentId/:designationId',
  validate(editOrganizationDepartmentDesignationSchema),
  updateOrganizationDepartmentDesignation,
);
router.delete(
  '/:organizationId/:departmentId/:designationId',
  deleteOrganizationDepartmentDesignation,
);

export default router;

// For redoc documentation
import { makeGet, makePost, makePut, makeDelete } from '../../../config/docs/method.swagger.js';
import {
  organizationDepartmentDesignationSchemaSwagger,
  createOrganizationDepartmentDesignationSchemaSwagger,
  editOrganizationDepartmentDesignationSchemaSwagger,
  organizationDepartmentDesignationIdSchemaSwagger,
} from './organizationDepartmentDesignation.validation.js';

const tag = 'Organization Department Designation';
export const organizationDepartmentDesignationPaths = {
  '/organization-department-designations': {
    get: makeGet(
      tag,
      'Get all organization department designations',
      organizationDepartmentDesignationSchemaSwagger,
      true,
    ),
    post: makePost(
      tag,
      'Create organization department designation',
      createOrganizationDepartmentDesignationSchemaSwagger,
      organizationDepartmentDesignationIdSchemaSwagger,
    ),
  },

  '/organization-department-designations/{organizationId}/{departmentId}/{designationId}': {
    get: makeGet(
      tag,
      'Get organization department designation',
      organizationDepartmentDesignationSchemaSwagger,
    ),
    put: makePut(
      tag,
      'Update organization department designation',
      editOrganizationDepartmentDesignationSchemaSwagger,
      organizationDepartmentDesignationIdSchemaSwagger,
    ),
    delete: makeDelete(
      tag,
      'Delete organization department designation',
      organizationDepartmentDesignationIdSchemaSwagger,
    ),
  },

  '/organization-department-designations/hard/{organizationId}/{departmentId}/{designationId}': {
    delete: makeDelete(
      tag,
      'Delete organization department designation permanently',
      organizationDepartmentDesignationIdSchemaSwagger,
    ),
  },
};

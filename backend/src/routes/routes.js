import { Router } from 'express';
import productRoutes from '../modules/product/product.routes.js';
import mediaRoutes from '../modules/media/media.routes.js';
import featureRoutes from '../modules/rba/feature/feature.routes.js';
import departmentRoutes from '../modules/rba/department/department.routes.js';
import designationRoutes from '../modules/rba/designation/designation.routes.js';
import permissionRoutes from '../modules/rba/permission/permission.routes.js';
import organizationRoutes from '../modules/rba/organization/organization.routes.js';
import roleRoutes from '../modules/rba/role/role.routes.js';
import roleFeaturePermissionRoutes from '../modules/rba/roleFeaturePermission/roleFeaturePermission.routes.js';
import organizationDepartmentDesignationRoutes from '../modules/rba/organizationDepartmentDesignation/organizationDepartmentDesignation.routes.js';
import userRoutes from '../modules/rba/user/user.routes.js';
import userDetailRoutes from '../modules/rba/userDetail/userDetail.routes.js';
import userRoleRoutes from '../modules/rba/userRole/userRole.routes.js';

const router = Router();

// ROLE BASED ACCESS MODELS
router.use('/feature', featureRoutes);
router.use('/department', departmentRoutes);
router.use('/designation', designationRoutes);
router.use('/organization', organizationRoutes);
router.use('/permission', permissionRoutes);
router.use('/role', roleRoutes);
router.use('/role-feature-permission', roleFeaturePermissionRoutes);
router.use('/organization-department-designation', organizationDepartmentDesignationRoutes);
router.use('/user', userRoutes);
router.use('/user-detail', userDetailRoutes);
router.use('/user-role', userRoleRoutes);

//
router.use('/products', productRoutes);
router.use('/media', mediaRoutes);

export default router;

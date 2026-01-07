import { configureStore } from '@reduxjs/toolkit';
import productReducer from './product/productSlice';
import mediaReducer from './media/media.slice';
import organizationReducer from './rba/organization/organizationSlice';
import departmentReducer from './rba/department/departmentSlice';
import designationReducer from './rba/designation/designationSlice';
import featureReducer from './rba/feature/featureSlice';
import permissionReducer from './rba/permission/permissionSlice';
import roleReducer from './rba/role/roleSlice';
import userReducer from './rba/user/userSlice';

export const store = configureStore({
  reducer: {
    products: productReducer,
    media: mediaReducer,
    organizations: organizationReducer,
    departments: departmentReducer,
    designations: designationReducer,
    features: featureReducer,
    permissions: permissionReducer,
    roles: roleReducer,
    users: userReducer,
  },
});

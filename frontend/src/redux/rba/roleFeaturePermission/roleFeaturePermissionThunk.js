import { createAsyncThunk } from '@reduxjs/toolkit';
import { roleFeaturePermissionApi } from '../../../api';

export const fetchPermissionsByRole = createAsyncThunk(
  'roleFeaturePermissions/fetchByRole',
  async (roleId, thunkAPI) => {
    try {
      const res = await roleFeaturePermissionApi.getByRole(roleId);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || 'Internal Server Error',
      );
    }
  },
);

export const bulkAssignPermissions = createAsyncThunk(
  'roleFeaturePermissions/bulkAssign',
  async ({ roleId, permissions }, thunkAPI) => {
    try {
      const res = await roleFeaturePermissionApi.bulkAssign(roleId, { permissions });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || 'Internal Server Error',
      );
    }
  },
);

export const bulkRemovePermissions = createAsyncThunk(
  'roleFeaturePermissions/bulkRemove',
  async ({ roleId, permissions }, thunkAPI) => {
    try {
      const res = await roleFeaturePermissionApi.bulkRemove(roleId, { permissions });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || 'Internal Server Error',
      );
    }
  },
);

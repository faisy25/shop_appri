import { createSlice } from '@reduxjs/toolkit';
import {
  fetchPermissionsByRole,
  bulkAssignPermissions,
  bulkRemovePermissions,
} from './roleFeaturePermissionThunk';

const initialState = {
  rolePermissions: [],
  loading: false,
  error: null,
};

const roleFeaturePermissionSlice = createSlice({
  name: 'roleFeaturePermissions',
  initialState,
  reducers: {
    clearRolePermissions: (state) => {
      state.rolePermissions = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch permissions by role
      .addCase(fetchPermissionsByRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissionsByRole.fulfilled, (state, action) => {
        state.loading = false;
        // Handle response structure: action.payload is { statusCode, message, data: [...] }
        // Extract the data array from the response
        const permissionsData = action.payload?.data || action.payload || [];
        state.rolePermissions = Array.isArray(permissionsData) ? permissionsData : [];
      })
      .addCase(fetchPermissionsByRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Bulk assign permissions
      .addCase(bulkAssignPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkAssignPermissions.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(bulkAssignPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Bulk remove permissions
      .addCase(bulkRemovePermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkRemovePermissions.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(bulkRemovePermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRolePermissions, clearError } = roleFeaturePermissionSlice.actions;

export default roleFeaturePermissionSlice.reducer;

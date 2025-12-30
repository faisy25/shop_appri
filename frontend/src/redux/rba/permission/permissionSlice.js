import { createSlice } from '@reduxjs/toolkit';
import {
  fetchPermissions,
  createPermission,
  fetchPermissionById,
  updatePermission,
  deletePermission,
} from './permissionThunk';

const initialState = {
  list: [],
  permission: null,
  loading: false,
  error: null,
};

const permissionSlice = createSlice({
  name: 'permissions',
  initialState,
  reducers: {
    clearPermissionError: (state) => {
      state.error = null;
    },
    clearSelectedPermission: (state) => {
      state.permission = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPermissions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPermissionById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPermissionById.fulfilled, (state, action) => {
        state.loading = false;
        state.permission = action.payload.data;
      })
      .addCase(fetchPermissionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPermission.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPermission.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createPermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updatePermission.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePermission.fulfilled, (state, action) => {
        state.loading = false;
        const updatedId = action.payload.data.permission_id;
        state.list = state.list.map((p) =>
          p.permission_id === updatedId ? { ...p, ...state.permission } : p,
        );
      })
      .addCase(updatePermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deletePermission.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePermission.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload.data.permission_id;
        state.list = state.list.filter((p) => p.permission_id !== deletedId);
      })
      .addCase(deletePermission.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearPermissionError, clearSelectedPermission } = permissionSlice.actions;
export default permissionSlice.reducer;


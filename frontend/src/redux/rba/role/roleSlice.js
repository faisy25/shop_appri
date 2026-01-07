import { createSlice } from '@reduxjs/toolkit';
import {
  fetchRoles,
  createRole,
  fetchRoleById,
  updateRole,
  deleteRole,
} from './roleThunk';

const initialState = {
  list: [],
  role: null,
  loading: false,
  error: null,
};

const roleSlice = createSlice({
  name: 'roles',
  initialState,
  reducers: {
    clearRoleError: (state) => {
      state.error = null;
    },
    clearSelectedRole: (state) => {
      state.role = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.loading = false;
        // Handle both response structures: action.payload.data or action.payload
        state.list = action.payload?.data || action.payload || [];
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchRoleById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRoleById.fulfilled, (state, action) => {
        state.loading = false;
        // Handle both response structures: action.payload.data or action.payload
        state.role = action.payload?.data || action.payload;
      })
      .addCase(fetchRoleById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.loading = false;
        // Add the newly created role to the list
        if (action.payload?.data) {
          state.list.push(action.payload.data);
        }
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.loading = false;
        const updatedId = action.payload.data.role_id;
        state.list = state.list.map((r) =>
          r.role_id === updatedId ? { ...r, ...state.role } : r,
        );
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteRole.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload.data.role_id;
        state.list = state.list.filter((r) => r.role_id !== deletedId);
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearRoleError, clearSelectedRole } = roleSlice.actions;
export default roleSlice.reducer;


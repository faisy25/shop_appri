import { createSlice, createSelector } from '@reduxjs/toolkit';
import {
  fetchOrganizations,
  createOrganization,
  fetchOrganizationById,
  updateOrganization,
  deleteOrganization,
} from './organizationThunk';

const initialState = {
  list: [],
  organization: null,
  loading: false,
  error: null,
};

const organizationSlice = createSlice({
  name: 'organizations',
  initialState,
  reducers: {
    clearOrganizationError: (state) => {
      state.error = null;
    },
    clearSelectedOrganization: (state) => {
      state.organization = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganizations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrganizations.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
      })
      .addCase(fetchOrganizations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrganizationById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrganizationById.fulfilled, (state, action) => {
        state.loading = false;
        state.organization = action.payload.data;
      })
      .addCase(fetchOrganizationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createOrganization.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrganization.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateOrganization.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateOrganization.fulfilled, (state, action) => {
        state.loading = false;
        const updatedId = action.payload.data.organization_id;
        state.list = state.list.map((o) =>
          o.organization_id === updatedId ? { ...o, ...state.organization } : o,
        );
      })
      .addCase(updateOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteOrganization.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteOrganization.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload.data.organization_id;
        state.list = state.list.filter((o) => o.organization_id !== deletedId);
      })
      .addCase(deleteOrganization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrganizationError, clearSelectedOrganization } = organizationSlice.actions;

// ========== SELECTORS ==========
// Base selector: Simple state accessor (no computation, always fast)
const selectOrganizationsList = (state) => state.organizations.list;

// Memoized selector: Derived data (only recalculates when list changes)
// Performance: O(n) only when organizations list changes, otherwise returns cached result
// Benefits:
// 1. Prevents unnecessary recalculations on every component render
// 2. Returns same array reference if input unchanged (prevents re-renders)
// 3. Scales well with large datasets (100+ organizations)
export const selectRootOrganizations = createSelector(
  [selectOrganizationsList],
  (organizations) => {
    // Filter organizations where parent_id is 0, null, or undefined (root organizations)
    return organizations.filter(
      (org) => org.parent_id === 0 || org.parent_id === null || org.parent_id === undefined,
    );
  },
);

export default organizationSlice.reducer;

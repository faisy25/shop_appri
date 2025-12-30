import { createSlice } from '@reduxjs/toolkit';
import {
  fetchDesignations,
  createDesignation,
  fetchDesignationById,
  updateDesignation,
  deleteDesignation,
} from './designationThunk';

const initialState = {
  list: [],
  designation: null,
  loading: false,
  error: null,
};

const designationSlice = createSlice({
  name: 'designations',
  initialState,
  reducers: {
    clearDesignationError: (state) => {
      state.error = null;
    },
    clearSelectedDesignation: (state) => {
      state.designation = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDesignations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDesignations.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
      })
      .addCase(fetchDesignations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchDesignationById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDesignationById.fulfilled, (state, action) => {
        state.loading = false;
        state.designation = action.payload.data;
      })
      .addCase(fetchDesignationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createDesignation.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDesignation.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createDesignation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateDesignation.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDesignation.fulfilled, (state, action) => {
        state.loading = false;
        const updatedId = action.payload.data.designation_id;
        state.list = state.list.map((d) =>
          d.designation_id === updatedId ? { ...d, ...state.designation } : d,
        );
      })
      .addCase(updateDesignation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteDesignation.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDesignation.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload.data.designation_id;
        state.list = state.list.filter((d) => d.designation_id !== deletedId);
      })
      .addCase(deleteDesignation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearDesignationError, clearSelectedDesignation } = designationSlice.actions;
export default designationSlice.reducer;


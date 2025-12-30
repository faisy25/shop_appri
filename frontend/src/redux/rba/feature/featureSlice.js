import { createSlice } from '@reduxjs/toolkit';
import {
  fetchFeatures,
  createFeature,
  fetchFeatureById,
  updateFeature,
  deleteFeature,
} from './featureThunk';

const initialState = {
  list: [],
  feature: null,
  loading: false,
  error: null,
};

const featureSlice = createSlice({
  name: 'features',
  initialState,
  reducers: {
    clearFeatureError: (state) => {
      state.error = null;
    },
    clearSelectedFeature: (state) => {
      state.feature = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeatures.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeatures.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
      })
      .addCase(fetchFeatures.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFeatureById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeatureById.fulfilled, (state, action) => {
        state.loading = false;
        state.feature = action.payload.data;
      })
      .addCase(fetchFeatureById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createFeature.pending, (state) => {
        state.loading = true;
      })
      .addCase(createFeature.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createFeature.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateFeature.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateFeature.fulfilled, (state, action) => {
        state.loading = false;
        const updatedId = action.payload.data.feature_id;
        state.list = state.list.map((f) =>
          f.feature_id === updatedId ? { ...f, ...state.feature } : f,
        );
      })
      .addCase(updateFeature.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteFeature.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteFeature.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload.data.feature_id;
        state.list = state.list.filter((f) => f.feature_id !== deletedId);
      })
      .addCase(deleteFeature.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFeatureError, clearSelectedFeature } = featureSlice.actions;
export default featureSlice.reducer;


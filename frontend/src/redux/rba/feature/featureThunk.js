import { createAsyncThunk } from '@reduxjs/toolkit';
import { featureApi } from '../../../api';

export const fetchFeatures = createAsyncThunk('features/fetchAll', async (filters = {}, thunkAPI) => {
  try {
    const res = await featureApi.getAll(filters);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || err.message || 'Internal Server Error',
    );
  }
});

export const fetchFeatureById = createAsyncThunk('features/fetchOne', async (id, thunkAPI) => {
  try {
    const res = await featureApi.getOne(id);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || err.message || 'Internal Server Error',
    );
  }
});

export const createFeature = createAsyncThunk('features/create', async (data, thunkAPI) => {
  try {
    const res = await featureApi.create(data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || err.message || 'Internal Server Error',
    );
  }
});

export const updateFeature = createAsyncThunk('features/update', async ({ id, data }, thunkAPI) => {
  try {
    const res = await featureApi.update(id, data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || err.message || 'Internal Server Error',
    );
  }
});

export const deleteFeature = createAsyncThunk('features/delete', async (id, thunkAPI) => {
  try {
    const res = await featureApi.delete(id);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || err.message || 'Internal Server Error',
    );
  }
});


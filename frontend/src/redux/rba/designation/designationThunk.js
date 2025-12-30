import { createAsyncThunk } from '@reduxjs/toolkit';
import { designationApi } from '../../../api';

export const fetchDesignations = createAsyncThunk(
  'designations/fetchAll',
  async (_, thunkAPI) => {
    try {
      const res = await designationApi.getAll();
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || 'Internal Server Error',
      );
    }
  },
);

export const fetchDesignationById = createAsyncThunk(
  'designations/fetchOne',
  async (id, thunkAPI) => {
    try {
      const res = await designationApi.getOne(id);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || 'Internal Server Error',
      );
    }
  },
);

export const createDesignation = createAsyncThunk(
  'designations/create',
  async (data, thunkAPI) => {
    try {
      const res = await designationApi.create(data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || 'Internal Server Error',
      );
    }
  },
);

export const updateDesignation = createAsyncThunk(
  'designations/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await designationApi.update(id, data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || 'Internal Server Error',
      );
    }
  },
);

export const deleteDesignation = createAsyncThunk(
  'designations/delete',
  async (id, thunkAPI) => {
    try {
      const res = await designationApi.delete(id);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || 'Internal Server Error',
      );
    }
  },
);


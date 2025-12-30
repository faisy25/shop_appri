import { createAsyncThunk } from '@reduxjs/toolkit';
import { organizationApi } from '../../../api';

export const fetchOrganizations = createAsyncThunk(
  'organizations/fetchAll',
  async (_, thunkAPI) => {
    try {
      const res = await organizationApi.getAll();
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || 'Internal Server Error',
      );
    }
  },
);

export const fetchOrganizationById = createAsyncThunk(
  'organizations/fetchOne',
  async (id, thunkAPI) => {
    try {
      const res = await organizationApi.getOne(id);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || 'Internal Server Error',
      );
    }
  },
);

export const createOrganization = createAsyncThunk(
  'organizations/create',
  async (data, thunkAPI) => {
    try {
      const res = await organizationApi.create(data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || 'Internal Server Error',
      );
    }
  },
);

export const updateOrganization = createAsyncThunk(
  'organizations/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await organizationApi.update(id, data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || 'Internal Server Error',
      );
    }
  },
);

export const deleteOrganization = createAsyncThunk(
  'organizations/delete',
  async (id, thunkAPI) => {
    try {
      const res = await organizationApi.delete(id);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || 'Internal Server Error',
      );
    }
  },
);


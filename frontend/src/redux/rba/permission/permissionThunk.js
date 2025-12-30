import { createAsyncThunk } from '@reduxjs/toolkit';
import { permissionApi } from '../../../api';

export const fetchPermissions = createAsyncThunk('permissions/fetchAll', async (_, thunkAPI) => {
  try {
    const res = await permissionApi.getAll();
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || err.message || 'Internal Server Error',
    );
  }
});

export const fetchPermissionById = createAsyncThunk(
  'permissions/fetchOne',
  async (id, thunkAPI) => {
    try {
      const res = await permissionApi.getOne(id);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || 'Internal Server Error',
      );
    }
  },
);

export const createPermission = createAsyncThunk(
  'permissions/create',
  async (data, thunkAPI) => {
    try {
      const res = await permissionApi.create(data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || 'Internal Server Error',
      );
    }
  },
);

export const updatePermission = createAsyncThunk(
  'permissions/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await permissionApi.update(id, data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || 'Internal Server Error',
      );
    }
  },
);

export const deletePermission = createAsyncThunk('permissions/delete', async (id, thunkAPI) => {
  try {
    const res = await permissionApi.delete(id);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || err.message || 'Internal Server Error',
    );
  }
});


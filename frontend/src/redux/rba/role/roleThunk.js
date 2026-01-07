import { createAsyncThunk } from '@reduxjs/toolkit';
import { roleApi } from '../../../api';

export const fetchRoles = createAsyncThunk('roles/fetchAll', async (filters = {}, thunkAPI) => {
  try {
    const res = await roleApi.getAll(filters);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || err.message || 'Internal Server Error',
    );
  }
});

export const fetchRoleById = createAsyncThunk('roles/fetchOne', async (id, thunkAPI) => {
  try {
    const res = await roleApi.getOne(id);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || err.message || 'Internal Server Error',
    );
  }
});

export const createRole = createAsyncThunk('roles/create', async (data, thunkAPI) => {
  try {
    const res = await roleApi.create(data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || err.message || 'Internal Server Error',
    );
  }
});

export const updateRole = createAsyncThunk('roles/update', async ({ id, data }, thunkAPI) => {
  try {
    const res = await roleApi.update(id, data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || err.message || 'Internal Server Error',
    );
  }
});

export const deleteRole = createAsyncThunk('roles/delete', async (id, thunkAPI) => {
  try {
    const res = await roleApi.delete(id);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || err.message || 'Internal Server Error',
    );
  }
});


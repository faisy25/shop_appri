import { createAsyncThunk } from '@reduxjs/toolkit';
import { userApi } from '../../../api';

export const fetchUsers = createAsyncThunk('users/fetchAll', async (_, thunkAPI) => {
  try {
    const res = await userApi.getAll();
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || err.message || 'Internal Server Error',
    );
  }
});

export const fetchUserById = createAsyncThunk('users/fetchOne', async (id, thunkAPI) => {
  try {
    const res = await userApi.getOne(id);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || err.message || 'Internal Server Error',
    );
  }
});

export const createUser = createAsyncThunk('users/create', async (data, thunkAPI) => {
  try {
    const res = await userApi.create(data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || err.message || 'Internal Server Error',
    );
  }
});

export const updateUser = createAsyncThunk('users/update', async ({ id, data }, thunkAPI) => {
  try {
    const res = await userApi.update(id, data);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || err.message || 'Internal Server Error',
    );
  }
});

export const deleteUser = createAsyncThunk('users/delete', async (id, thunkAPI) => {
  try {
    const res = await userApi.delete(id);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || err.message || 'Internal Server Error',
    );
  }
});


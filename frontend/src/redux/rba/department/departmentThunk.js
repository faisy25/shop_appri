import { createAsyncThunk } from '@reduxjs/toolkit';
import { departmentApi } from '../../../api';

export const fetchDepartments = createAsyncThunk('departments/fetchAll', async (_, thunkAPI) => {
  try {
    const res = await departmentApi.getAll();
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || err.message || 'Internal Server Error',
    );
  }
});

export const fetchDepartmentById = createAsyncThunk(
  'departments/fetchOne',
  async (id, thunkAPI) => {
    try {
      const res = await departmentApi.getOne(id);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || 'Internal Server Error',
      );
    }
  },
);

export const createDepartment = createAsyncThunk(
  'departments/create',
  async (data, thunkAPI) => {
    try {
      const res = await departmentApi.create(data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || 'Internal Server Error',
      );
    }
  },
);

export const updateDepartment = createAsyncThunk(
  'departments/update',
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await departmentApi.update(id, data);
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || 'Internal Server Error',
      );
    }
  },
);

export const deleteDepartment = createAsyncThunk('departments/delete', async (id, thunkAPI) => {
  try {
    const res = await departmentApi.delete(id);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || err.message || 'Internal Server Error',
    );
  }
});


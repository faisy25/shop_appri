import { createAsyncThunk } from '@reduxjs/toolkit';
import { productApi } from '../../api';

// Thunks takes (name : products/fetchAll , async () => {} ) [name and async callback function]
export const fetchProducts = createAsyncThunk('products/fetchAll', async (_, thunkAPI) => {
  try {
    const res = await productApi.getAll();
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || err.message || 'Internal Server Error',
    );
  }
});

export const fetchProductById = createAsyncThunk('products/fetchOne', async (id, thunkAPI) => {
  try {
    const res = await productApi.getOne(id);
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || err.message || 'Internal Server Error',
    );
  }
});

export const createProduct = createAsyncThunk('products/create', async (data, thunkAPI) => {
  try {
    const res = await productApi.create(data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || err.message || 'Internal Server Error',
    );
  }
});

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, formData }, thunkAPI) => {
    try {
      const res = await productApi.update(id, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || err.message || 'Internal Server Error',
      );
    }
  },
);

export const deleteProduct = createAsyncThunk('products/delete', async (id, thunkAPI) => {
  try {
    const res = await productApi.delete(id);
    return res.data; // other method : return ID instead of response (res.data)
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || err.message || 'Internal Server Error',
    );
  }
});

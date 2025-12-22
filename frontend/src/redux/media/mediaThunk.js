import { createAsyncThunk } from '@reduxjs/toolkit';
import { mediaApi } from '../../api';

export const deleteMedia = createAsyncThunk('media/delete', async (id, thunkAPI) => {
  try {
    const res = await mediaApi.delete(id);
    return res.data; // other method : return ID instead of response (res.data)
  } catch (err) {
    return thunkAPI.rejectWithValue(
      err.response?.data?.message || err.message || 'Internal Server Error',
    );
  }
});

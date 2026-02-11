import { createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "@/api";

export const login = createAsyncThunk(
    "auth/login",
    async (credentials, thunkAPI) => {
        try {
            const response = await authApi.login(credentials);
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                  error.response?.data?.message || error.message || 'Internal Server Error',
            );
        }
    }
);

export const refreshToken = createAsyncThunk(
    "auth/refreshToken",
    async (_, thunkAPI) => {
        try {
            const response = await authApi.refreshToken()
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || err.message || 'Internal Server Error',
            );
        }
    }
);

export const logout = createAsyncThunk(
    "auth/logout",
    async (_, thunkAPI) => {
        try {
            const response = await authApi.logout();
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message || 'Internal Server Error',
            );
        }
    }
);

export const me = createAsyncThunk(
    "auth/me",
    async (_, thunkAPI) => {
        try {
            const response = await authApi.me();
            return response.data;
        } catch (error) {
            return thunkAPI.rejectWithValue(
                error.response?.data?.message || error.message || 'Internal Server Error',
            );
        }
    }
);


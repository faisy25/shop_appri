import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    accessToken: null,
    refreshToken: null,
    refreshExpiresAt: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        // Start login process
        loginStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        
        // Login successful
        loginSuccess: (state, action) => {
            const { user, tokens } = action.payload;
            state.user = user;
            state.accessToken = tokens.access_token;
            state.refreshToken = tokens.refresh_token;
            state.refreshExpiresAt = tokens.refresh_expires_at;
            state.isAuthenticated = true;
            state.loading = false;
            state.error = null;
        },
        
        // Login failed
        loginFailure: (state, action) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.refreshExpiresAt = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = action.payload;
        },
        
        // Refresh tokens (when access token expires)
        refreshTokensSuccess: (state, action) => {
            state.accessToken = action.payload.access_token;
            state.refreshToken = action.payload.refresh_token;
            state.refreshExpiresAt = action.payload.refresh_expires_at;
        },
        
        // Refresh failed (user needs to login again)
        refreshTokensFailure: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.refreshExpiresAt = null;
            state.isAuthenticated = false;
            state.error = "Session expired. Please login again.";
        },
        
        // Logout
        logout: (state) => {
            state.user = null;
            state.accessToken = null;
            state.refreshToken = null;
            state.refreshExpiresAt = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
        },
        
        // Clear error
        clearError: (state) => {
            state.error = null;
        },
    },
});

export const { 
    loginStart,
    loginSuccess, 
    loginFailure,
    refreshTokensSuccess,
    refreshTokensFailure,
    logout,
    clearError
} = authSlice.actions;

export default authSlice.reducer;
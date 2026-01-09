import { createSlice } from '@reduxjs/toolkit';
import { fetchUsers, createUser, fetchUserById, updateUser, deleteUser } from './userThunk';

const initialState = {
  list: [],
  user: null,
  loading: false,
  error: null,
  // Multi-step form state
  formData: {
    step1: {
      organization_id: null,
      department_id: null,
      designation_id: null,
      role_ids: [],
    },
    step2: {
      name: '',
      email: '',
    },
    step3: {
      phone: '',
      alternate_phone: '',
      country: '',
      date_of_birth: null,
      gender: null,
      profile_picture_url: '',
      bio: '',
    },
  },
  currentStep: 0,
};

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    clearSelectedUser: (state) => {
      state.user = null;
    },
    // Multi-step form actions
    updateFormData: (state, action) => {
      const { step, data } = action.payload;
      // Data should already be serialized (ISO strings) when passed from components
      // This ensures Redux state remains serializable
      state.formData[step] = { ...state.formData[step], ...data };
    },
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    resetFormData: (state) => {
      state.formData = initialState.formData;
      state.currentStep = 0;
    },
    initializeFormFromUser: (state, action) => {
      const user = action.payload;
      if (user) {
        // Step 1: Extract role information (use first role's org/dept/desig for filters)
        const firstRole = user.roles && user.roles.length > 0 ? user.roles[0] : null;
        state.formData.step1 = {
          organization_id: firstRole?.organization?.organization_id || null,
          department_id: firstRole?.department?.department_id || null,
          designation_id: firstRole?.designation?.designation_id || null,
          role_ids: user.roles ? user.roles.map((r) => r.role_id) : [],
        };

        // Step 2: Basic user info
        state.formData.step2 = {
          name: user.name || '',
          email: user.email || '',
        };

        // Step 3: User details
        state.formData.step3 = {
          phone: user.user_detail?.phone || '',
          alternate_phone: user.user_detail?.alternate_phone || '',
          country: user.user_detail?.country || '',
          date_of_birth: user.user_detail?.date_of_birth || null,
          gender: user.user_detail?.gender || null,
          profile_picture_url: user.user_detail?.profile_picture_url || '',
          bio: user.user_detail?.bio || '',
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload?.data || action.payload || [];
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload?.data || action.payload;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.data) {
          state.list.push(action.payload.data);
        }
        // Reset form after successful creation
        state.formData = initialState.formData;
        state.currentStep = 0;
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload?.data || action.payload;
        const index = state.list.findIndex((u) => u.user_id === updatedUser.user_id);
        if (index !== -1) {
          state.list[index] = updatedUser;
        }
        // Reset form after successful update
        state.formData = initialState.formData;
        state.currentStep = 0;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload?.data?.user_id;
        if (deletedId) {
          state.list = state.list.filter((u) => u.user_id !== deletedId);
        }
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearUserError,
  clearSelectedUser,
  updateFormData,
  setCurrentStep,
  resetFormData,
  initializeFormFromUser,
} = userSlice.actions;

export default userSlice.reducer;

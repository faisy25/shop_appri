import { createSlice } from '@reduxjs/toolkit';
import { deleteMedia } from './mediaThunk';

const initialState = {
  list: [],
  media: null,
  loading: false,
  error: null,
};

const mediaSlice = createSlice({
  name: 'media',
  initialState,
  reducers: {
    clearMediaError: (state) => {
      state.error = null;
    },
    clearSelectedMedia: (state) => {
      state.media = null;
    },
  },
  extraReducers: (builder) => {
    builder

      // // fetch all
      // .addCase(fetchProducts.pending, (state) => {
      //   state.loading = true;
      // })
      // .addCase(fetchProducts.fulfilled, (state, action) => {
      //   state.loading = false;
      //   state.list = action.payload.data;
      // })
      // .addCase(fetchProducts.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload;
      // })

      // Delete
      .addCase(deleteMedia.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteMedia.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = Number(action.payload.data.media_id);
        state.list = state.list.filter((p) => p.media_id !== deletedId);

        const { media_id } = action.payload.data;
        if (media_id) {
          state.list = state.list.filter((p) => p.media_id !== media_id);
        }
      })
      .addCase(deleteMedia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProductError, clearSelectedProduct } = mediaSlice.actions;

export default mediaSlice.reducer;

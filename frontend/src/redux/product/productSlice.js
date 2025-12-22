import { createSlice } from '@reduxjs/toolkit';
import {
  fetchProducts,
  createProduct,
  fetchProductById,
  updateProduct,
  deleteProduct,
} from './productThunk';

const initialState = {
  list: [],
  product: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
    clearSelectedProduct: (state) => {
      state.product = null;
    },

    // Add this new reducer to handle media deletion
    removeMediaFromProduct: (state, action) => {
      const mediaId = action.payload;
      if (state.product && state.product.media) {
        state.product.media = state.product.media.filter((m) => m.media_id !== mediaId);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch all
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // fetchProductbyId
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload.data;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;

        // Your API returns only product_id on create, NOT full product
        // → So we must fetch products again or skip adding
        // Option 1 (recommended): Do nothing here, list refresh happens automatically when page loads
        // Option 2: Push after re-fetching (better UX)
        console.log(action.payload.data.product_id);

        // state.list.push(action.payload.data);  --- old ---
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;

        const updatedId = Number(action.payload.data.product_id);

        // We do NOT have full updated data from backend
        // So best practice is re-fetch product list after update in UI
        state.list = state.list.map((p) =>
          p.product_id === updatedId ? { ...p, ...state.product } : p,
        );
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = Number(action.payload.data.product_id);
        state.list = state.list.filter((p) => p.product_id !== deletedId);

        const { product_id } = action.payload.data;
        if (product_id) {
          state.list = state.list.filter((p) => p.product_id !== product_id);
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearProductError, clearSelectedProduct, removeMediaFromProduct } =
  productSlice.actions;

export default productSlice.reducer;

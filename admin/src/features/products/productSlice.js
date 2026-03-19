import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api.js'

export const fetchProducts = createAsyncThunk('products/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products')
    return data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch products')
  }
})

export const createProduct = createAsyncThunk('products/create', async (productData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/products', productData)
    return data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create product')
  }
})

export const updateProduct = createAsyncThunk('products/update', async ({ id, updates }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/products/${id}`, updates)
    return data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update product')
  }
})

export const deleteProduct = createAsyncThunk('products/delete', async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/products/${id}`)
    return id
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to delete product')
  }
})

export const searchProductsByHsn = createAsyncThunk(
  'products/searchByHsn',
  async (hsn, { rejectWithValue }) => {
    try {
      const { data } = await api.get(`/products/search/hsn?hsn=${encodeURIComponent(hsn)}`)
      return data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'HSN search failed')
    }
  },
)

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
    searchResults: [],
    searchLoading: false,
  },
  reducers: {
    clearSearch(state) {
      state.searchResults = []
    },
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.error = action.payload
      })

      .addCase(updateProduct.fulfilled, (state, action) => {
        const idx = state.items.findIndex((p) => p._id === action.payload._id)
        if (idx !== -1) state.items[idx] = action.payload
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload
      })

      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p._id !== action.payload)
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload
      })

      .addCase(searchProductsByHsn.pending, (state) => {
        state.searchLoading = true
      })
      .addCase(searchProductsByHsn.fulfilled, (state, action) => {
        state.searchLoading = false
        state.searchResults = action.payload
      })
      .addCase(searchProductsByHsn.rejected, (state) => {
        state.searchLoading = false
        state.searchResults = []
      })
  },
})

export const { clearSearch, clearError } = productSlice.actions
export default productSlice.reducer

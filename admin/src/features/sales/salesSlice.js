import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api.js'

export const fetchAllSales = createAsyncThunk('sales/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/sales')
    return data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch sales')
  }
})

export const fetchSalesByDate = createAsyncThunk('sales/fetchByDate', async (date, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/sales/by-date?date=${date}`)
    return data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch sales for this date')
  }
})

const salesSlice = createSlice({
  name: 'sales',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllSales.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllSales.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchAllSales.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(fetchSalesByDate.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchSalesByDate.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchSalesByDate.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError } = salesSlice.actions
export default salesSlice.reducer

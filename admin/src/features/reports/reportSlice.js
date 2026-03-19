import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api.js'

export const fetchDailySummary = createAsyncThunk(
  'reports/fetchDaily',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/reports/daily-summary')
      return data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch daily summary')
    }
  },
)

export const fetchMonthlySummary = createAsyncThunk(
  'reports/fetchMonthly',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/reports/monthly-summary')
      return data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch monthly summary')
    }
  },
)

const reportSlice = createSlice({
  name: 'reports',
  initialState: {
    dailySummary: [],
    monthlySummary: [],
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
      .addCase(fetchDailySummary.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchDailySummary.fulfilled, (state, action) => {
        state.loading = false
        state.dailySummary = action.payload
      })
      .addCase(fetchDailySummary.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(fetchMonthlySummary.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchMonthlySummary.fulfilled, (state, action) => {
        state.loading = false
        state.monthlySummary = action.payload
      })
      .addCase(fetchMonthlySummary.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError } = reportSlice.actions
export default reportSlice.reducer

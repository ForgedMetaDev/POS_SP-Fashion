import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api.js'

export const fetchUsers = createAsyncThunk('users/fetchAll', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/users')
    return data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch users')
  }
})

export const createUser = createAsyncThunk('users/create', async (userData, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/users', userData)
    return data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to create user')
  }
})

export const updateUser = createAsyncThunk('users/update', async ({ id, updates }, { rejectWithValue }) => {
  try {
    const { data } = await api.put(`/users/${id}`, updates)
    return data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update user')
  }
})

export const toggleUserStatus = createAsyncThunk('users/toggleStatus', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.patch(`/users/${id}/toggle-status`)
    return data.data
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to toggle user status')
  }
})

const userSlice = createSlice({
  name: 'users',
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
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      .addCase(createUser.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      .addCase(createUser.rejected, (state, action) => {
        state.error = action.payload
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        const idx = state.items.findIndex((u) => u._id === action.payload._id)
        if (idx !== -1) state.items[idx] = action.payload
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload
      })

      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        const idx = state.items.findIndex((u) => u._id === action.payload._id)
        if (idx !== -1) state.items[idx] = action.payload
      })
      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const { clearError } = userSlice.actions
export default userSlice.reducer

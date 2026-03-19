import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice.js'
import productReducer from '../features/products/productSlice.js'
import salesReducer from '../features/sales/salesSlice.js'
import userReducer from '../features/users/userSlice.js'
import dashboardReducer from '../features/dashboard/dashboardSlice.js'
import reportReducer from '../features/reports/reportSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    sales: salesReducer,
    users: userReducer,
    dashboard: dashboardReducer,
    reports: reportReducer,
  },
})

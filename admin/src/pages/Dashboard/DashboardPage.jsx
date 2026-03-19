import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Alert,
  Paper,
  Skeleton,
} from '@mui/material'
import {
  TrendingUp,
  ShoppingCart,
  WarningAmber,
  CurrencyRupee,
} from '@mui/icons-material'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { fetchDashboardMetrics } from '../../features/dashboard/dashboardSlice.js'
import { fetchDailySummary } from '../../features/reports/reportSlice.js'
import { formatCurrency } from '../../utils/formatCurrency.js'

function StatCard({ title, value, icon, bgcolor, iconColor }) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="text.secondary" variant="body2" fontWeight={500} gutterBottom>
              {title}
            </Typography>
            <Typography variant="h5" fontWeight={700} color="text.primary">
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              bgcolor,
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box sx={{ color: iconColor }}>{icon}</Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

function DashboardPage() {
  const dispatch = useDispatch()
  const { metrics, loading } = useSelector((state) => state.dashboard)
  const { dailySummary } = useSelector((state) => state.reports)

  useEffect(() => {
    dispatch(fetchDashboardMetrics())
    dispatch(fetchDailySummary())
  }, [dispatch])

  const chartData = [...dailySummary]
    .slice(0, 14)
    .reverse()
    .map((item) => ({
      date: item._id,
      'Final Sales': Number(item.finalAmount.toFixed(2)),
      Orders: item.orderCount,
    }))

  const statsCards = [
    {
      title: "Today's Sales",
      value: loading ? '—' : formatCurrency(metrics?.todaySalesTotal),
      icon: <CurrencyRupee />,
      bgcolor: 'rgba(46, 125, 50, 0.12)',
      iconColor: '#2e7d32',
    },
    {
      title: 'Monthly Sales',
      value: loading ? '—' : formatCurrency(metrics?.monthlySalesTotal),
      icon: <TrendingUp />,
      bgcolor: 'rgba(26, 35, 126, 0.12)',
      iconColor: '#1a237e',
    },
    {
      title: 'Total Orders',
      value: loading ? '—' : (metrics?.totalOrders ?? 0),
      icon: <ShoppingCart />,
      bgcolor: 'rgba(2, 136, 209, 0.12)',
      iconColor: '#0288d1',
    },
    {
      title: 'Low Stock Items',
      value: loading ? '—' : (metrics?.lowStockProductsCount ?? 0),
      icon: <WarningAmber />,
      bgcolor: 'rgba(237, 108, 2, 0.12)',
      iconColor: '#ed6c02',
    },
  ]

  return (
    <Box>
      <Typography variant="h5" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {statsCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            {loading && !metrics ? (
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Skeleton width="60%" />
                  <Skeleton width="40%" height={40} />
                </CardContent>
              </Card>
            ) : (
              <StatCard {...card} />
            )}
          </Grid>
        ))}
      </Grid>

      {/* Charts + Low Stock */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Sales Trend — Last 14 Days
            </Typography>
            {chartData.length === 0 ? (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography color="text.secondary">No sales data available for chart</Typography>
              </Box>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(val) => val.slice(5)}
                  />
                  <YAxis
                    tick={{ fontSize: 11 }}
                    tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(value, name) =>
                      name === 'Final Sales' ? [formatCurrency(value), name] : [value, name]
                    }
                  />
                  <Legend />
                  <Bar dataKey="Final Sales" fill="#1a237e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Low Stock Products
            </Typography>
            {loading && !metrics ? (
              [1, 2, 3].map((i) => <Skeleton key={i} height={60} sx={{ mb: 1 }} />)
            ) : metrics?.lowStockProducts?.length === 0 ? (
              <Alert severity="success" sx={{ mt: 1 }}>
                All products are well-stocked
              </Alert>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                {metrics?.lowStockProducts?.map((product) => (
                  <Box
                    key={product._id}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      p: 1.5,
                      bgcolor: 'rgba(211, 47, 47, 0.06)',
                      borderRadius: 1,
                      border: '1px solid rgba(211, 47, 47, 0.2)',
                    }}
                  >
                    <Box>
                      <Typography variant="body2" fontWeight={600}>
                        {product.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {product.productCode}
                      </Typography>
                    </Box>
                    <Chip
                      label={`Qty: ${product.quantity}`}
                      color="error"
                      size="small"
                      variant="filled"
                    />
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default DashboardPage

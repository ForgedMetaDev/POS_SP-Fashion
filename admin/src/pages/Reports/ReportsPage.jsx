import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material'
import { Download } from '@mui/icons-material'
import { fetchDailySummary, fetchMonthlySummary } from '../../features/reports/reportSlice.js'
import api from '../../services/api.js'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import { formatCurrency } from '../../utils/formatCurrency.js'

function SummaryTable({ data, type }) {
  const label = type === 'daily' ? 'Date' : 'Month'

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow sx={{ bgcolor: 'primary.main' }}>
            {[label, 'Orders', 'Amount', 'CGST', 'SGST', 'Final Amount'].map((h) => (
              <TableCell key={h} sx={{ color: 'white', fontWeight: 600 }}>
                {h}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                <Typography color="text.secondary">No report data available</Typography>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={row._id} hover>
                <TableCell>
                  <Typography fontWeight={500}>{row._id}</Typography>
                </TableCell>
                <TableCell>{row.orderCount}</TableCell>
                <TableCell>{formatCurrency(row.totalAmount)}</TableCell>
                <TableCell>{formatCurrency(row.cgst)}</TableCell>
                <TableCell>{formatCurrency(row.sgst)}</TableCell>
                <TableCell>
                  <Typography fontWeight={700} color="primary.main">
                    {formatCurrency(row.finalAmount)}
                  </Typography>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

function ReportsPage() {
  const dispatch = useDispatch()
  const { dailySummary, monthlySummary, loading } = useSelector((state) => state.reports)

  const [tab, setTab] = useState(0)
  const [downloading, setDownloading] = useState(false)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  useEffect(() => {
    dispatch(fetchDailySummary())
    dispatch(fetchMonthlySummary())
  }, [dispatch])

  const handleExport = async () => {
    try {
      setDownloading(true)
      const endpoint = tab === 0 ? '/reports/daily-summary/excel' : '/reports/monthly-summary/excel'
      const filename = tab === 0 ? 'daily-sales-summary.xlsx' : 'monthly-sales-summary.xlsx'

      const response = await api.get(endpoint, { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', filename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      setSnackbar({ open: true, message: 'Excel exported successfully', severity: 'success' })
    } catch {
      setSnackbar({ open: true, message: 'Failed to export report', severity: 'error' })
    } finally {
      setDownloading(false)
    }
  }

  const activeData = tab === 0 ? dailySummary : monthlySummary

  if (loading && dailySummary.length === 0 && monthlySummary.length === 0) {
    return <LoadingSpinner message="Loading reports..." />
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          mb: 3,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          Reports
        </Typography>
        <Button
          variant="contained"
          startIcon={downloading ? <CircularProgress size={16} color="inherit" /> : <Download />}
          onClick={handleExport}
          disabled={downloading}
        >
          {downloading ? 'Exporting...' : `Export ${tab === 0 ? 'Daily' : 'Monthly'} Excel`}
        </Button>
      </Box>

      <Paper sx={{ p: 2, mb: 2 }}>
        <Tabs value={tab} onChange={(_, newValue) => setTab(newValue)}>
          <Tab label="Daily Report" />
          <Tab label="Monthly Report" />
        </Tabs>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <SummaryTable data={activeData} type={tab === 0 ? 'daily' : 'monthly'} />
        </Grid>
      </Grid>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default ReportsPage

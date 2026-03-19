import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Chip,
  Button,
  Alert,
} from '@mui/material'
import { FilterAlt, FilterAltOff } from '@mui/icons-material'
import { fetchAllSales, fetchSalesByDate } from '../../features/sales/salesSlice.js'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import { formatCurrency } from '../../utils/formatCurrency.js'
import { formatDateTime } from '../../utils/formatDate.js'

function SalesPage() {
  const dispatch = useDispatch()
  const { items: sales, loading, error } = useSelector((state) => state.sales)
  const [dateFilter, setDateFilter] = useState('')

  useEffect(() => {
    dispatch(fetchAllSales())
  }, [dispatch])

  const handleApplyFilter = () => {
    if (dateFilter) {
      dispatch(fetchSalesByDate(dateFilter))
    } else {
      dispatch(fetchAllSales())
    }
  }

  const handleClearFilter = () => {
    setDateFilter('')
    dispatch(fetchAllSales())
  }

  const totalRevenue = sales.reduce((sum, s) => sum + s.finalAmount, 0)

  if (loading && sales.length === 0) return <LoadingSpinner message="Loading sales..." />

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Sales
        </Typography>
        {sales.length > 0 && (
          <Chip
            label={`Total Revenue: ${formatCurrency(totalRevenue)}`}
            color="primary"
            variant="filled"
            sx={{ fontWeight: 700 }}
          />
        )}
      </Box>

      {/* Date Filter */}
      <Box sx={{ display: 'flex', gap: 1.5, mb: 3, alignItems: 'center' }}>
        <TextField
          type="date"
          size="small"
          label="Filter by Date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={{ width: 200 }}
        />
        <Button variant="contained" size="small" startIcon={<FilterAlt />} onClick={handleApplyFilter}>
          Apply
        </Button>
        {dateFilter && (
          <Button variant="outlined" size="small" startIcon={<FilterAltOff />} onClick={handleClearFilter}>
            Clear
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              {['#', 'Items', 'Total Amount', 'CGST', 'SGST', 'Final Amount', 'Sold By', 'Date'].map((h) => (
                <TableCell key={h} sx={{ color: 'white', fontWeight: 600 }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {sales.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">
                    {dateFilter ? 'No sales found for this date' : 'No sales recorded yet'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              sales.map((sale, idx) => (
                <TableRow key={sale._id} hover>
                  <TableCell sx={{ width: 50 }}>{idx + 1}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                      {sale.items.map((item, i) => (
                        <Box key={i}>
                          <Typography variant="body2" fontWeight={500}>
                            {item.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            HSN: {item.hsnCode} &nbsp;|&nbsp; Qty: {item.quantity} &nbsp;|&nbsp;
                            Price: {formatCurrency(item.sellingPrice)} &nbsp;|&nbsp; GST: {item.gstRate}%
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>{formatCurrency(sale.totalAmount)}</TableCell>
                  <TableCell>{formatCurrency(sale.cgst)}</TableCell>
                  <TableCell>{formatCurrency(sale.sgst)}</TableCell>
                  <TableCell>
                    <Typography fontWeight={700} color="primary.main">
                      {formatCurrency(sale.finalAmount)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={sale.soldBy?.fullName || sale.soldBy?.username || 'N/A'}
                      size="small"
                      variant="outlined"
                      color="default"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" noWrap>
                      {formatDateTime(sale.createdAt)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default SalesPage

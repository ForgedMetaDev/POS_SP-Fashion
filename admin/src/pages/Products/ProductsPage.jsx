import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Alert,
  Snackbar,
  Tooltip,
  CircularProgress,
} from '@mui/material'
import { Add, Edit, DeleteOutline, Search } from '@mui/icons-material'
import {
  fetchProducts,
  deleteProduct,
  searchProductsByHsn,
  clearSearch,
} from '../../features/products/productSlice.js'
import ProductFormDialog from './ProductFormDialog.jsx'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'
import { formatCurrency } from '../../utils/formatCurrency.js'
import { debounce } from '../../utils/debounce.js'

function ProductsPage() {
  const dispatch = useDispatch()
  const { items: products, loading, searchResults, searchLoading } = useSelector(
    (state) => state.products,
  )

  const [openForm, setOpenForm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [hsnSearch, setHsnSearch] = useState('')
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  useEffect(() => {
    dispatch(fetchProducts())
  }, [dispatch])

  const debouncedHsnSearch = useMemo(
    () =>
      debounce((value) => {
        if (value.trim()) {
          dispatch(searchProductsByHsn(value.trim()))
        } else {
          dispatch(clearSearch())
        }
      }, 450),
    [dispatch],
  )

  const handleHsnChange = (e) => {
    const value = e.target.value
    setHsnSearch(value)
    debouncedHsnSearch(value)
  }

  const handleClearSearch = () => {
    setHsnSearch('')
    dispatch(clearSearch())
  }

  const displayedProducts = hsnSearch.trim() ? searchResults : products

  const handleEdit = (product) => {
    setSelectedProduct(product)
    setOpenForm(true)
  }

  const handleDeleteConfirm = async () => {
    const result = await dispatch(deleteProduct(deleteId))
    if (deleteProduct.fulfilled.match(result)) {
      setSnackbar({ open: true, message: 'Product deleted successfully', severity: 'success' })
    } else {
      setSnackbar({ open: true, message: result.payload || 'Delete failed', severity: 'error' })
    }
    setDeleteId(null)
  }

  const isLowStock = (p) => p.quantity <= p.lowStockThreshold

  const handleFormClose = (success) => {
    setOpenForm(false)
    if (success) {
      setSnackbar({
        open: true,
        message: selectedProduct ? 'Product updated successfully' : 'Product created successfully',
        severity: 'success',
      })
    }
  }

  if (loading && products.length === 0) return <LoadingSpinner message="Loading products..." />

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Products
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setSelectedProduct(null)
            setOpenForm(true)
          }}
        >
          Add Product
        </Button>
      </Box>

      {/* HSN Search */}
      <Box sx={{ mb: 2 }}>
        <TextField
          size="small"
          placeholder="Search by HSN Code..."
          value={hsnSearch}
          onChange={handleHsnChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                {searchLoading ? <CircularProgress size={16} /> : <Search />}
              </InputAdornment>
            ),
          }}
          sx={{ width: 320 }}
        />
        {hsnSearch && (
          <Button size="small" sx={{ ml: 1 }} onClick={handleClearSearch}>
            Clear
          </Button>
        )}
        {hsnSearch && (
          <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
            {searchResults.length} result(s) for &quot;{hsnSearch}&quot;
          </Typography>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              {[
                'Product Code',
                'HSN Code',
                'Name',
                'Type',
                'Qty',
                'Purchase Price',
                'MRP',
                'GST %',
                'Stock Status',
                'Actions',
              ].map((h) => (
                <TableCell key={h} sx={{ color: 'white', fontWeight: 600, py: 1.5 }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">
                    {hsnSearch ? 'No products matched your HSN search' : 'No products found'}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              displayedProducts.map((product) => (
                <TableRow
                  key={product._id}
                  sx={{
                    bgcolor: isLowStock(product) ? 'rgba(211,47,47,0.05)' : 'inherit',
                    '&:hover': {
                      bgcolor: isLowStock(product)
                        ? 'rgba(211,47,47,0.1)'
                        : 'rgba(0,0,0,0.04)',
                    },
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" fontFamily="monospace" fontWeight={500}>
                      {product.productCode}
                    </Typography>
                  </TableCell>
                  <TableCell>{product.hsnCode}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {product.name}
                    </Typography>
                  </TableCell>
                  <TableCell>{product.type}</TableCell>
                  <TableCell>
                    <Chip
                      label={product.quantity}
                      color={isLowStock(product) ? 'error' : 'success'}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>{formatCurrency(product.purchasePrice)}</TableCell>
                  <TableCell>{formatCurrency(product.mrp)}</TableCell>
                  <TableCell>{product.gstRate}%</TableCell>
                  <TableCell>
                    {isLowStock(product) ? (
                      <Chip label="Low Stock" color="error" size="small" />
                    ) : (
                      <Chip label="In Stock" color="success" size="small" />
                    )}
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit product">
                      <IconButton size="small" color="primary" onClick={() => handleEdit(product)}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete product">
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => setDeleteId(product._id)}
                      >
                        <DeleteOutline fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <ProductFormDialog open={openForm} product={selectedProduct} onClose={handleFormClose} />

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteId(null)}
      />

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

export default ProductsPage

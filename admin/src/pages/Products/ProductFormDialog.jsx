import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
  CircularProgress,
  Typography,
} from '@mui/material'
import { createProduct, updateProduct } from '../../features/products/productSlice.js'

const GST_RATES = [0, 5, 12, 18, 28]

const CLOTHING_TYPES = [
  'Topwear',
  'Bottomwear',
  'Footwear',
  'Innerwear',
  'Ethnic Wear',
  'Winter Wear',
  'Sportswear',
  'Accessories',
  'Other',
]

const DEFAULT_FORM = {
  hsnCode: '',
  name: '',
  type: '',
  quantity: '',
  purchasePrice: '',
  mrp: '',
  gstRate: 12,
  lowStockThreshold: '',
}

function ProductFormDialog({ open, product, onClose }) {
  const dispatch = useDispatch()
  const [form, setForm] = useState(DEFAULT_FORM)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (product) {
      setForm({
        hsnCode: product.hsnCode,
        name: product.name,
        type: product.type,
        quantity: product.quantity,
        purchasePrice: product.purchasePrice,
        mrp: product.mrp,
        gstRate: product.gstRate,
        lowStockThreshold: product.lowStockThreshold,
      })
    } else {
      setForm(DEFAULT_FORM)
    }
    setErrors({})
  }, [product, open])

  const validate = () => {
    const errs = {}
    if (!form.hsnCode.trim()) errs.hsnCode = 'HSN Code is required'
    if (!form.name.trim()) errs.name = 'Product name is required'
    if (!form.type) errs.type = 'Product type is required'
    if (form.quantity === '' || Number(form.quantity) < 0)
      errs.quantity = 'Quantity must be 0 or more'
    if (!form.purchasePrice || Number(form.purchasePrice) <= 0)
      errs.purchasePrice = 'Purchase price must be greater than 0'
    if (!form.mrp || Number(form.mrp) <= 0) errs.mrp = 'MRP must be greater than 0'
    if (form.lowStockThreshold === '' || Number(form.lowStockThreshold) < 0)
      errs.lowStockThreshold = 'Low stock threshold must be 0 or more'
    return errs
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = async () => {
    const validation = validate()
    if (Object.keys(validation).length > 0) {
      setErrors(validation)
      return
    }

    setSubmitting(true)
    const payload = {
      ...form,
      quantity: Number(form.quantity),
      purchasePrice: Number(form.purchasePrice),
      mrp: Number(form.mrp),
      gstRate: Number(form.gstRate),
      lowStockThreshold: Number(form.lowStockThreshold),
    }

    let result
    if (product) {
      result = await dispatch(updateProduct({ id: product._id, updates: payload }))
    } else {
      result = await dispatch(createProduct(payload))
    }
    setSubmitting(false)

    if ((product ? updateProduct : createProduct).fulfilled.match(result)) {
      onClose(true)
    } else {
      setErrors({ submit: result.payload || 'Operation failed. Please try again.' })
    }
  }

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>
        {product ? 'Edit Product' : 'Add New Product'}
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item xs={12}>
            <TextField
              label="Product Code"
              value={product?.productCode || 'Auto-generated on save'}
              fullWidth
              disabled
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="HSN Code"
              name="hsnCode"
              value={form.hsnCode}
              onChange={handleChange}
              error={!!errors.hsnCode}
              helperText={errors.hsnCode}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Product Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Product Type"
              name="type"
              value={form.type}
              onChange={handleChange}
              error={!!errors.type}
              helperText={errors.type}
              fullWidth
              size="small"
              select
            >
              {CLOTHING_TYPES.map((t) => (
                <MenuItem key={t} value={t}>
                  {t}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
              error={!!errors.quantity}
              helperText={errors.quantity}
              fullWidth
              size="small"
              inputProps={{ min: 0 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Purchase Price (₹)"
              name="purchasePrice"
              type="number"
              value={form.purchasePrice}
              onChange={handleChange}
              error={!!errors.purchasePrice}
              helperText={errors.purchasePrice}
              fullWidth
              size="small"
              inputProps={{ min: 0, step: '0.01' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="MRP (₹)"
              name="mrp"
              type="number"
              value={form.mrp}
              onChange={handleChange}
              error={!!errors.mrp}
              helperText={errors.mrp}
              fullWidth
              size="small"
              inputProps={{ min: 0, step: '0.01' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="GST Rate"
              name="gstRate"
              value={form.gstRate}
              onChange={handleChange}
              fullWidth
              size="small"
              select
            >
              {GST_RATES.map((r) => (
                <MenuItem key={r} value={r}>
                  {r}%
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Low Stock Threshold"
              name="lowStockThreshold"
              type="number"
              value={form.lowStockThreshold}
              onChange={handleChange}
              error={!!errors.lowStockThreshold}
              helperText={errors.lowStockThreshold}
              fullWidth
              size="small"
              inputProps={{ min: 0 }}
            />
          </Grid>
          {errors.submit && (
            <Grid item xs={12}>
              <Typography color="error" variant="body2">
                {errors.submit}
              </Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={() => onClose(false)} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting}
          startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
        >
          {product ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ProductFormDialog

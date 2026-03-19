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
import { createUser, updateUser } from '../../features/users/userSlice.js'

const ROLES = ['admin', 'worker']

const DEFAULT_FORM = {
  fullName: '',
  username: '',
  password: '',
  role: 'worker',
}

function UserFormDialog({ open, user, onClose }) {
  const dispatch = useDispatch()
  const [form, setForm] = useState(DEFAULT_FORM)
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName,
        username: user.username,
        password: '',
        role: user.role,
      })
    } else {
      setForm(DEFAULT_FORM)
    }
    setErrors({})
  }, [user, open])

  const validate = () => {
    const errs = {}
    if (!form.fullName.trim()) errs.fullName = 'Full name is required'
    if (!form.username.trim()) errs.username = 'Username is required'
    if (!user && (!form.password || form.password.length < 6))
      errs.password = 'Password must be at least 6 characters'
    if (!form.role) errs.role = 'Role is required'
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
      fullName: form.fullName.trim(),
      username: form.username.trim().toLowerCase(),
      role: form.role,
    }
    if (!user) payload.password = form.password
    if (user && form.password) payload.password = form.password

    const result = user
      ? await dispatch(updateUser({ id: user._id, updates: payload }))
      : await dispatch(createUser(payload))

    setSubmitting(false)

    if ((user ? updateUser : createUser).fulfilled.match(result)) {
      onClose(true)
    } else {
      setErrors({ submit: result.payload || 'Operation failed. Please try again.' })
    }
  }

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>{user ? 'Edit User' : 'Create Worker'}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ pt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Full Name"
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              error={!!errors.fullName}
              helperText={errors.fullName}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              error={!!errors.username}
              helperText={errors.username}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label={user ? 'Password (optional)' : 'Password'}
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              error={!!errors.password}
              helperText={errors.password || (user ? 'Leave blank to keep existing password' : '')}
              fullWidth
              size="small"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Role"
              name="role"
              value={form.role}
              onChange={handleChange}
              error={!!errors.role}
              helperText={errors.role}
              fullWidth
              size="small"
              select
            >
              {ROLES.map((role) => (
                <MenuItem key={role} value={role}>
                  {role.toUpperCase()}
                </MenuItem>
              ))}
            </TextField>
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
          {user ? 'Update User' : 'Create User'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UserFormDialog

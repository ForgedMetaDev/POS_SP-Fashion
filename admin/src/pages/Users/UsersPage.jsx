import { useEffect, useState } from 'react'
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
  Alert,
  Snackbar,
  Tooltip,
} from '@mui/material'
import { PersonAddAlt1, Edit, ToggleOn, ToggleOff } from '@mui/icons-material'
import { fetchUsers, toggleUserStatus } from '../../features/users/userSlice.js'
import UserFormDialog from './UserFormDialog.jsx'
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx'

function UsersPage() {
  const dispatch = useDispatch()
  const { items: users, loading } = useSelector((state) => state.users)
  const [openForm, setOpenForm] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

  const handleToggleStatus = async (id) => {
    const result = await dispatch(toggleUserStatus(id))
    if (toggleUserStatus.fulfilled.match(result)) {
      setSnackbar({
        open: true,
        message: `User ${result.payload.isActive ? 'activated' : 'deactivated'} successfully`,
        severity: 'success',
      })
    } else {
      setSnackbar({ open: true, message: result.payload || 'Operation failed', severity: 'error' })
    }
  }

  const handleFormClose = (success) => {
    setOpenForm(false)
    if (success) {
      setSnackbar({
        open: true,
        message: selectedUser ? 'User updated successfully' : 'User created successfully',
        severity: 'success',
      })
    }
  }

  if (loading && users.length === 0) return <LoadingSpinner message="Loading users..." />

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          Users
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddAlt1 />}
          onClick={() => {
            setSelectedUser(null)
            setOpenForm(true)
          }}
        >
          Create Worker
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'primary.main' }}>
              {['Full Name', 'Username', 'Role', 'Status', 'Created At', 'Actions'].map((h) => (
                <TableCell key={h} sx={{ color: 'white', fontWeight: 600 }}>
                  {h}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">No users found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell>
                    <Typography fontWeight={600}>{user.fullName}</Typography>
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>
                    <Chip
                      label={user.role.toUpperCase()}
                      size="small"
                      color={user.role === 'admin' ? 'primary' : 'default'}
                      variant={user.role === 'admin' ? 'filled' : 'outlined'}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={user.isActive ? 'Active' : 'Inactive'}
                      color={user.isActive ? 'success' : 'error'}
                      size="small"
                      variant="filled"
                    />
                  </TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString('en-IN')}</TableCell>
                  <TableCell>
                    <Tooltip title="Edit user">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => {
                          setSelectedUser(user)
                          setOpenForm(true)
                        }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={user.isActive ? 'Deactivate user' : 'Activate user'}>
                      <IconButton
                        size="small"
                        color={user.isActive ? 'error' : 'success'}
                        onClick={() => handleToggleStatus(user._id)}
                      >
                        {user.isActive ? <ToggleOff fontSize="small" /> : <ToggleOn fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <UserFormDialog open={openForm} user={selectedUser} onClose={handleFormClose} />

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

export default UsersPage

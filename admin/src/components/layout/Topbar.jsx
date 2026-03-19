import { AppBar, Toolbar, Typography, Box, IconButton, Chip, Tooltip } from '@mui/material'
import { Logout as LogoutIcon } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../features/auth/authSlice.js'

function Topbar({ drawerWidth }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login', { replace: true })
  }

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: `calc(100% - ${drawerWidth}px)`,
        ml: `${drawerWidth}px`,
        bgcolor: 'white',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ justifyContent: 'flex-end', gap: 2 }}>
        {user && (
          <>
            <Chip
              label={user.role?.toUpperCase()}
              size="small"
              color="primary"
              variant="filled"
              sx={{ fontWeight: 700, fontSize: '0.7rem' }}
            />
            <Typography variant="body2" fontWeight={600} color="text.primary">
              {user.fullName}
            </Typography>
            <Tooltip title="Logout">
              <IconButton onClick={handleLogout} size="small" color="inherit">
                <LogoutIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        )}
      </Toolbar>
    </AppBar>
  )
}

export default Topbar

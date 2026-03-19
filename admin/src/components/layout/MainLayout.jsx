import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar.jsx'
import Topbar from './Topbar.jsx'

const DRAWER_WIDTH = 240

function MainLayout() {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar drawerWidth={DRAWER_WIDTH} />
      <Box
        component="main"
        sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}
      >
        <Topbar drawerWidth={DRAWER_WIDTH} />
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            bgcolor: 'background.default',
            mt: '64px',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  )
}

export default MainLayout

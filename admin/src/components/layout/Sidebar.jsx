import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Box,
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  Inventory2 as ProductsIcon,
  PointOfSale as SalesIcon,
  People as UsersIcon,
  Assessment as ReportsIcon,
} from '@mui/icons-material'
import { NavLink } from 'react-router-dom'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { label: 'Products', icon: <ProductsIcon />, path: '/products' },
  { label: 'Sales', icon: <SalesIcon />, path: '/sales' },
  { label: 'Users', icon: <UsersIcon />, path: '/users' },
  { label: 'Reports', icon: <ReportsIcon />, path: '/reports' },
]

function Sidebar({ drawerWidth }) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          bgcolor: '#1a237e',
          color: 'white',
          borderRight: 'none',
        },
      }}
    >
      <Toolbar sx={{ px: 2 }}>
        <Box>
          <Typography variant="h6" fontWeight={800} sx={{ color: 'white', lineHeight: 1.2 }}>
            SP Fashion
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', letterSpacing: 1 }}>
            ADMIN PANEL
          </Typography>
        </Box>
      </Toolbar>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.15)', mx: 2 }} />

      <List sx={{ mt: 1, px: 1 }}>
        {NAV_ITEMS.map((item) => (
          <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
            <ListItemButton
              component={NavLink}
              to={item.path}
              sx={{
                borderRadius: 2,
                color: 'rgba(255,255,255,0.65)',
                '&.active': {
                  bgcolor: 'rgba(255,255,255,0.18)',
                  color: 'white',
                  '& .MuiListItemIcon-root': { color: 'white' },
                },
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                  color: 'white',
                },
              }}
            >
              <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{ fontWeight: 500, fontSize: '0.9rem' }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  )
}

export default Sidebar

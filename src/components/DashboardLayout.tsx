import { useState, ReactElement } from 'react';
import { 
  AppBar, 
  Box, 
  CssBaseline, 
  Divider, 
  Drawer, 
  IconButton, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Toolbar, 
  Typography, 
  Button, 
  Chip 
} from '@mui/material';
import { 
  Menu as MenuIcon, 
  Dashboard as DashboardIcon, 
  Receipt as ReceiptIcon, 
  AddCircle as AddCircleIcon, 
  Settings as SettingsIcon, 
  Logout as LogoutIcon, 
  SmartToy as SmartToyIcon, 
  Star as StarIcon 
} from '@mui/icons-material';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const DRAWER_WIDTH = 240;

interface Company {
  plan: string;
}

interface User {
  company?: Company;
}

interface MenuItemConfig {
  text: string;
  icon: ReactElement;
  path: string;
}

export const DashboardLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Lógica segura para obtener el plan (evita que la pantalla se ponga blanca si falla)
  const getUserPlan = (): string => {
    try {
      const userString = localStorage.getItem('user');
      if (!userString) return 'FREE';
      const userData: User = JSON.parse(userString);
      return userData.company?.plan || 'FREE';
    } catch {
      return 'FREE';
    }
  };

  const currentPlan = getUserPlan();
  const isPro = currentPlan === 'PRO';

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems: MenuItemConfig[] = [
    { text: 'Resumen', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Mis Facturas', icon: <ReceiptIcon />, path: '/dashboard/invoices' },
    { text: 'Crear Factura', icon: <AddCircleIcon />, path: '/dashboard/create-invoice' },
    ...(isPro ? [{ 
        text: 'Asistente IA', 
        icon: <SmartToyIcon sx={{ color: '#9c27b0' }} />, 
        path: '/dashboard/ai-chat' 
    }] : []),
    { text: 'Configuración', icon: <SettingsIcon />, path: '/dashboard/settings' },
  ];

  // Contenido del Drawer (el menú lateral)
  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar sx={{ backgroundColor: '#1976d2', color: 'white' }}>
        <Typography variant="h6" noWrap component="div" fontWeight="bold">
          SmartBiz
        </Typography>
        <Chip 
          label={currentPlan} 
          size="small" 
          sx={{ ml: 2, bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold' }} 
        />
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Box sx={{ mt: 'auto', p: 2 }}>
        {!isPro && (
          <Button 
            variant="contained" 
            color="warning" 
            fullWidth 
            startIcon={<StarIcon />}
            sx={{ mb: 2, fontWeight: 'bold' }}
            onClick={() => navigate('/dashboard/pricing')}
          >
            Mejorar Plan
          </Button>
        )}
        <Divider sx={{ mb: 2 }} />
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon><LogoutIcon color="error" /></ListItemIcon>
          <ListItemText primary="Cerrar Sesión" sx={{ color: 'error.main' }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    // IMPORTANTE: display: 'flex' es vital para que el menú y el contenido estén lado a lado
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      {/* Barra Superior (AppBar) */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Panel de Control
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Navegación Lateral (Drawer) */}
      <Box
        component="nav"
        sx={{ width: { sm: DRAWER_WIDTH }, flexShrink: { sm: 0 } }}
      >
        {/* Drawer para Móvil (Temporary) */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' }, // Solo visible en pantallas pequeñas
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Drawer para Escritorio (Permanent) */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' }, // Solo visible en pantallas grandes
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: DRAWER_WIDTH },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Contenido Principal */}
      <Box
        component="main"
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
          backgroundColor: '#f5f5f5'
        }}
      >
        <Toolbar /> {/* Espaciador para que el AppBar no tape el contenido */}
        <Outlet />
      </Box>
    </Box>
  );
};
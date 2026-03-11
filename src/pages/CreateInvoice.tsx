import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  Button, 
  Grid, 
  Divider, 
  IconButton, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Snackbar, 
  Alert, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { API_CONFIG } from '../config/api';

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface Customer {
  name: string;
  nit: string;
  email: string;
}

interface ToastState {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
}

export const CreateInvoice = () => {
  const navigate = useNavigate();
  
  const [customer, setCustomer] = useState<Customer>({ name: '', nit: '', email: '' });
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [currentItem, setCurrentItem] = useState<InvoiceItem>({ description: '', quantity: 1, unitPrice: 0 });
  
  const [toast, setToast] = useState<ToastState>({ open: false, message: '', severity: 'error' });
  const [openLimitModal, setOpenLimitModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const addItem = () => {
    if (!currentItem.description.trim()) {
      setToast({ open: true, message: 'La descripción es obligatoria', severity: 'error' });
      return;
    }
    if (currentItem.quantity <= 0 || currentItem.unitPrice < 0) {
      setToast({ open: true, message: 'Cantidades y precios deben ser válidos', severity: 'error' });
      return;
    }
    
    setItems([...items, currentItem]);
    setCurrentItem({ description: '', quantity: 1, unitPrice: 0 });
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!customer.name || !customer.nit || !customer.email) {
      setToast({ open: true, message: 'Complete los datos del cliente', severity: 'error' });
      return;
    }
    
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.INVOICES}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          customerName: customer.name,
          customerNit: customer.nit,
          customerEmail: customer.email,
          items: items
        })
      });

      const data = await response.json();

      if (response.ok) {
        setToast({ open: true, message: 'Factura emitida con éxito', severity: 'success' });
        setTimeout(() => navigate('/dashboard/invoices'), 1500);
      } else {
        if (response.status === 403) {
           setOpenLimitModal(true);
        } else {
           setToast({ open: true, message: data.message || 'Error creando factura', severity: 'error' });
        }
      }
    } catch (error) {
      setToast({ open: true, message: 'Error de conexión con el servidor', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const tax = subtotal * 0.19;
  const total = subtotal + tax;

  return (
    <Box maxWidth="lg" mx="auto">
      <Box display="flex" alignItems="center" mb={3} gap={2}>
        <IconButton onClick={() => navigate('/dashboard/invoices')}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4" fontWeight="800" color="text.primary">Nueva Factura</Typography>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">1. Datos del Cliente</Typography>
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <TextField 
              fullWidth 
              label="Nombre / Razón Social" 
              value={customer.name} 
              onChange={e => setCustomer({...customer, name: e.target.value})} 
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField 
              fullWidth 
              label="NIT / Documento" 
              value={customer.nit} 
              onChange={e => setCustomer({...customer, nit: e.target.value})} 
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField 
              fullWidth 
              label="Email (Para envío)" 
              type="email"
              value={customer.email} 
              onChange={e => setCustomer({...customer, email: e.target.value})} 
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" gutterBottom fontWeight="bold" color="primary">2. Productos / Servicios</Typography>
        <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8f9fa', mb: 3, border: '1px solid #e0e0e0' }}>
          <Grid container spacing={2} alignItems="center">
             <Grid item xs={12} md={5}>
               <TextField 
                 fullWidth 
                 label="Descripción del ítem" 
                 size="small"
                 value={currentItem.description} 
                 onChange={e => setCurrentItem({...currentItem, description: e.target.value})} 
               />
             </Grid>
             <Grid item xs={6} md={2}>
               <TextField 
                 fullWidth 
                 type="number" 
                 label="Cantidad" 
                 size="small"
                 value={currentItem.quantity} 
                 onChange={e => setCurrentItem({...currentItem, quantity: Math.max(0, Number(e.target.value))})} 
               />
             </Grid>
             <Grid item xs={6} md={3}>
               <TextField 
                 fullWidth 
                 type="number" 
                 label="Precio Unitario" 
                 size="small"
                 value={currentItem.unitPrice} 
                 onChange={e => setCurrentItem({...currentItem, unitPrice: Math.max(0, Number(e.target.value))})} 
                 InputProps={{ startAdornment: <Typography color="text.secondary" mr={1}>$</Typography> }}
               />
             </Grid>
             <Grid item xs={12} md={2}>
               <Button 
                 fullWidth 
                 variant="contained" 
                 color="secondary"
                 startIcon={<AddCircleIcon />}
                 onClick={addItem}
                 disabled={!currentItem.description}
               >
                 Agregar
               </Button>
             </Grid>
          </Grid>
        </Paper>

        <TableContainer sx={{ mb: 4, border: '1px solid #f0f0f0', borderRadius: 1 }}>
          <Table>
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell width="50%"><strong>Descripción</strong></TableCell>
                <TableCell align="right"><strong>Cant</strong></TableCell>
                <TableCell align="right"><strong>Unitario</strong></TableCell>
                <TableCell align="right"><strong>Total</strong></TableCell>
                <TableCell align="right" width="50"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 4, color: 'text.secondary' }}>
                    No has agregado productos a la factura.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">${item.unitPrice.toLocaleString('es-CO')}</TableCell>
                    <TableCell align="right">${(item.quantity * item.unitPrice).toLocaleString('es-CO')}</TableCell>
                    <TableCell align="right">
                      <IconButton color="error" size="small" onClick={() => removeItem(idx)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
            <Typography variant="body1">Subtotal: <strong>${subtotal.toLocaleString('es-CO')}</strong></Typography>
            <Typography variant="body1">IVA (19%): <strong>${tax.toLocaleString('es-CO')}</strong></Typography>
            <Typography variant="h5" color="primary" sx={{ mt: 1 }}>Total: <strong>${total.toLocaleString('es-CO')}</strong></Typography>
        </Box>

        <Box sx={{ mt: 5, textAlign: 'right', display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
           <Button 
             variant="outlined" 
             size="large"
             onClick={() => navigate('/dashboard/invoices')}
             disabled={loading}
           >
             Cancelar
           </Button>
           <Button 
             variant="contained" 
             startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />} 
             size="large"
             onClick={handleSave}
             disabled={loading || items.length === 0}
             sx={{ px: 4, fontWeight: 'bold' }}
           >
             {loading ? 'Emitiendo...' : 'Emitir Factura'}
           </Button>
        </Box>
      </Paper>

      <Snackbar 
        open={toast.open} 
        autoHideDuration={5000} 
        onClose={() => setToast({...toast, open: false})}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={toast.severity} variant="filled" sx={{ width: '100%' }}>{toast.message}</Alert>
      </Snackbar>

      <Dialog open={openLimitModal} onClose={() => setOpenLimitModal(false)}>
        <DialogTitle sx={{ color: '#d32f2f', fontWeight: 'bold' }}>¡Límite del Plan Alcanzado!</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Has alcanzado el número máximo de facturas permitidas en tu plan actual. Actualiza tu suscripción para continuar facturando sin límites.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenLimitModal(false)} color="inherit">Cerrar</Button>
          <Button onClick={() => navigate('/dashboard/pricing')} variant="contained" color="warning" autoFocus>
            Ver Planes Premium
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
import { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip, 
  IconButton, 
  Tooltip, 
  Snackbar, 
  Alert,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CodeIcon from '@mui/icons-material/Code';
import { CreateInvoice } from './CreateInvoice';
import { API_CONFIG } from '../config/api';

interface Invoice {
  id: string;
  prefix: string;
  number: number;
  customerName: string;
  customerNit: string;
  date: string;
  total: number;
  dianStatus: string;
  dianXml?: string;
}

interface ToastState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'info' | 'warning';
}

export const Billing = () => {
  const [view, setView] = useState<'list' | 'create'>('list');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: '',
    severity: 'info'
  });

  const showToast = (message: string, severity: 'success' | 'error') => {
    setToast({ open: true, message, severity });
  };

  const handleCloseToast = () => {
    setToast(prev => ({ ...prev, open: false }));
  };

  const fetchInvoices = useCallback(async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.INVOICES}`, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) throw new Error('Error al obtener facturas');

      const data = await response.json();
      setInvoices(data);
    } catch (error) {
      showToast('No se pudieron cargar las facturas', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const handleDownload = async (id: string, type: 'pdf' | 'xml', prefix: string, number: number) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.INVOICES}/${id}/${type}`;
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!response.ok) throw new Error(`Error descargando ${type.toUpperCase()}`);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Factura-${prefix}${number}.${type}`);
      document.body.appendChild(link);
      link.click();
      
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showToast(`Archivo ${type.toUpperCase()} descargado`, 'success');
    } catch (error) {
      showToast(`Error al descargar el archivo ${type.toUpperCase()}`, 'error');
    }
  };

  if (view === 'create') {
    return (
      <CreateInvoice 
        onCancel={() => setView('list')} 
        onSuccess={() => {
          setView('list');
          fetchInvoices();
          showToast('Factura creada exitosamente', 'success');
        }} 
      />
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" fontWeight="bold">Facturación Electrónica</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => setView('create')}
        >
          Nueva Factura
        </Button>
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead sx={{ bgcolor: '#f5f5f5' }}>
            <TableRow>
              <TableCell><strong>Número</strong></TableCell>
              <TableCell><strong>Cliente</strong></TableCell>
              <TableCell><strong>Fecha</strong></TableCell>
              <TableCell align="right"><strong>Total</strong></TableCell>
              <TableCell align="center"><strong>Estado DIAN</strong></TableCell>
              <TableCell align="center"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  <CircularProgress size={24} />
                </TableCell>
              </TableRow>
            ) : invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  No hay facturas creadas aún.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((inv) => (
                <TableRow key={inv.id} hover>
                  <TableCell>{inv.prefix}-{inv.number}</TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="bold">{inv.customerName}</Typography>
                    <Typography variant="caption" color="text.secondary">{inv.customerNit}</Typography>
                  </TableCell>
                  <TableCell>{new Date(inv.date).toLocaleDateString()}</TableCell>
                  <TableCell align="right">${Number(inv.total).toLocaleString('es-CO')}</TableCell>
                  <TableCell align="center">
                    <Chip 
                      label={inv.dianStatus === 'SENT' ? 'Enviada' : inv.dianStatus} 
                      color={inv.dianStatus === 'SENT' ? 'success' : 'default'} 
                      size="small" 
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Descargar PDF">
                      <IconButton 
                        onClick={() => handleDownload(inv.id, 'pdf', inv.prefix, inv.number)}
                        color="primary"
                        size="small"
                      >
                        <PictureAsPdfIcon />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Descargar XML">
                      <IconButton 
                        onClick={() => handleDownload(inv.id, 'xml', inv.prefix, inv.number)}
                        color="secondary"
                        size="small"
                        sx={{ ml: 1 }}
                      >
                        <CodeIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Snackbar 
        open={toast.open} 
        autoHideDuration={6000} 
        onClose={handleCloseToast}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseToast} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
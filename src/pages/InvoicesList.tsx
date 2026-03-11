import { useEffect, useState, useCallback } from 'react';
import { 
  Box, 
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
  CircularProgress, 
  Button, 
  Snackbar, 
  Alert, 
  Tooltip,
  Pagination,
  Stack
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { API_CONFIG } from '../config/api';

interface Invoice {
  id: string;
  prefix: string;
  number: number;
  customerName: string;
  date: string;
  total: number;
  dianXml?: string;
  status?: string; // Opcional, si tu backend lo devuelve
}

interface ToastState {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
}

export const InvoicesList = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  // Estados para paginación (preparación)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1); 
  const [toast, setToast] = useState<ToastState>({ open: false, message: '', severity: 'error' });
  
  const navigate = useNavigate();

  const fetchInvoices = useCallback(async (currentPage: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // TODO: Cuando ajustemos el backend, cambiaremos esto a: 
      // `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.INVOICES}?page=${currentPage}&limit=10`
      const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.INVOICES}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (!res.ok) throw new Error();
      
      const data = await res.json();
      
      // Si el backend devuelve array directo (actual):
      if (Array.isArray(data)) {
        setInvoices(data);
        setTotalPages(1); // Temporal hasta que haya backend paginado
      } else {
        // Si el backend devuelve objeto paginado (futuro):
        setInvoices(data.items || []);
        setTotalPages(data.meta?.totalPages || 1);
      }

    } catch (error) {
      setToast({ open: true, message: 'Error al cargar el historial de facturas', severity: 'error' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInvoices(page);
  }, [fetchInvoices, page]);

  const handleDownloadPDF = async (id: string, prefix: string, number: number) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.INVOICES}/${id}/pdf`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error();

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Factura-${prefix}${number}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      setToast({ open: true, message: 'Descarga iniciada', severity: 'success' });
    } catch (error) {
      setToast({ open: true, message: 'No se pudo descargar el PDF', severity: 'error' });
    }
  };

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  if (loading && invoices.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" fontWeight="800" color="text.primary">Mis Facturas</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />} 
          onClick={() => navigate('/dashboard/create-invoice')}
          sx={{ fontWeight: 'bold' }}
        >
          Nueva Factura
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2, mb: 2 }}>
        <Table>
          <TableHead sx={{ bgcolor: '#f8f9fa' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold' }}>Número</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Cliente</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Estado DIAN</TableCell>
              <TableCell align="right" sx={{ fontWeight: 'bold' }}>Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                  No se encontraron facturas registradas.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((inv) => {
                const isAuthorized = !!inv.dianXml; // Lógica temporal
                
                return (
                  <TableRow key={inv.id} hover>
                    <TableCell sx={{ fontWeight: 500 }}>{inv.prefix}{inv.number}</TableCell>
                    <TableCell>{inv.customerName}</TableCell>
                    <TableCell>{new Date(inv.date).toLocaleDateString()}</TableCell>
                    <TableCell>${Number(inv.total).toLocaleString('es-CO')}</TableCell>
                    <TableCell>
                      <Chip 
                        label={isAuthorized ? "Autorizada" : "Borrador / Pendiente"} 
                        color={isAuthorized ? "success" : "default"} 
                        size="small" 
                        variant="outlined"
                        sx={{ fontWeight: 'bold' }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Tooltip title={isAuthorized ? "Descargar PDF" : "PDF no disponible"}>
                        <span>
                          <IconButton 
                            size="small" 
                            color="primary"
                            disabled={!isAuthorized}
                            onClick={() => handleDownloadPDF(inv.id, inv.prefix, inv.number)}
                          >
                            <DownloadIcon />
                          </IconButton>
                        </span>
                      </Tooltip>
                      <Tooltip title="Ver Detalles">
                        <IconButton size="small" onClick={() => navigate(`/dashboard/invoices/${inv.id}`)}>
                          <VisibilityIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Componente de Paginación */}
      <Stack spacing={2} alignItems="center" sx={{ mt: 2 }}>
        <Pagination 
          count={totalPages} 
          page={page} 
          onChange={handlePageChange} 
          color="primary" 
          showFirstButton 
          showLastButton
        />
      </Stack>

      <Snackbar 
        open={toast.open} 
        autoHideDuration={4000} 
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={toast.severity} variant="filled" sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
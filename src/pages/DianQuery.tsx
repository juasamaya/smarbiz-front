import { useState } from 'react';
import { 
  Box, TextField, Button, Card, CardContent, Typography, 
  MenuItem, Grid, Snackbar, Alert, CircularProgress, Chip 
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { API_CONFIG } from '../config/api';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

interface DianResult {
  name: string;
  email: string;
}

interface DianFormData {
  identificationType: string;
  identificationNumber: string;
}

interface ToastState {
  open: boolean;
  message: string;
  severity: 'success' | 'error';
}

const DOC_TYPES = [
  { value: '13', label: 'Cédula de Ciudadanía' },
  { value: '31', label: 'NIT' },
  { value: '21', label: 'Tarjeta de Extranjería' },
  { value: '22', label: 'Cédula de Extranjería' },
];

export const DianQuery = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<DianFormData>();
  const [result, setResult] = useState<DianResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: '',
    severity: 'error'
  });

  const showToast = (message: string, severity: 'success' | 'error') => {
    setToast({ open: true, message, severity });
  };

  const onSubmit = async (formData: DianFormData) => {
    setLoading(true);
    setResult(null);
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_CONFIG.BASE_URL}/dian/get-acquirer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error();

      const data: DianResult = await response.json();
      setResult(data);
      showToast('Consulta exitosa', 'success');
    } catch (err) {
      showToast('Error consultando a la DIAN. Verifique los datos.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 800, color: 'primary.main' }}>
        Consulta de Adquirentes DIAN
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        Valida la información tributaria de tus clientes en tiempo real.
      </Typography>

      <Card elevation={0} sx={{ border: '1px solid #e0e0e0', mb: 4, borderRadius: 2 }}>
        <CardContent sx={{ p: 3 }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} alignItems="flex-start">
              <Grid item xs={12} md={4}>
                <TextField 
                  select 
                  fullWidth 
                  label="Tipo de Documento" 
                  defaultValue="13" 
                  {...register('identificationType', { required: true })}
                >
                  {DOC_TYPES.map((option) => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} md={5}>
                <TextField 
                  fullWidth 
                  label="Número de Documento" 
                  placeholder="Ej: 41604345" 
                  {...register('identificationNumber', { 
                    required: true, 
                    minLength: 5,
                    pattern: /^[0-9]+$/
                  })} 
                  error={!!errors.identificationNumber} 
                  helperText={errors.identificationNumber ? "Ingrese un número válido" : ""} 
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Button 
                  fullWidth 
                  variant="contained" 
                  size="large" 
                  type="submit" 
                  disabled={loading} 
                  sx={{ height: 56, fontWeight: 'bold' }}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SearchIcon />}
                >
                  {loading ? 'Consultando...' : 'Consultar'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>

      {result && (
        <Card sx={{ borderLeft: '6px solid #4caf50', borderRadius: 2, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <CheckCircleIcon color="success" />
              <Typography variant="h6" fontWeight="bold">Contribuyente Encontrado</Typography>
              <Chip label="Activo" color="success" size="small" variant="outlined" sx={{ fontWeight: 'bold' }} />
            </Box>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                  Razón Social / Nombre
                </Typography>
                <Typography variant="body1" fontWeight="600" sx={{ color: 'text.primary' }}>{result.name}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase', fontWeight: 'bold' }}>
                  Correo Electrónico (Facturación)
                </Typography>
                <Typography variant="body1" fontWeight="600" sx={{ color: 'text.primary' }}>{result.email}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      <Snackbar 
        open={toast.open} 
        autoHideDuration={4000} 
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setToast({ ...toast, open: false })} 
          severity={toast.severity} 
          variant="filled" 
          sx={{ width: '100%', fontWeight: 'bold' }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};
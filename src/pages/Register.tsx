import { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Container, 
  Grid, 
  Alert, 
  Link, 
  CircularProgress 
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { API_CONFIG } from '../config/api';

const registerSchema = z.object({
  name: z.string().min(3, "El nombre es obligatorio"),
  email: z.string().email("Correo electrónico inválido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  businessName: z.string().min(3, "La razón social es obligatoria"),
  nit: z.string().min(5, "El NIT es obligatorio"),
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

export const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema)
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onSubmit = async (data: RegisterFormInputs) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error en el registro');
      }

      navigate('/login', { state: { success: 'Cuenta creada exitosamente. Por favor inicia sesión.' } });
    } catch (err: unknown) {
      if (err instanceof Error) {
        setErrorMsg(err.message);
      } else {
        setErrorMsg('Ocurrió un error inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', borderRadius: 2 }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom fontWeight="800" color="primary">
            Crear Cuenta SmartBiz
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary" mb={3}>
            Comienza a gestionar tu facturación hoy mismo
          </Typography>

          {errorMsg && <Alert severity="error" sx={{ mb: 2 }}>{errorMsg}</Alert>}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required 
                  fullWidth 
                  label="Nombre Completo"
                  {...register('name')}
                  error={!!errors.name} 
                  helperText={errors.name?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required 
                  fullWidth 
                  label="Correo Electrónico"
                  type="email"
                  {...register('email')}
                  error={!!errors.email} 
                  helperText={errors.email?.message}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required 
                  fullWidth 
                  label="Contraseña" 
                  type="password"
                  {...register('password')}
                  error={!!errors.password} 
                  helperText={errors.password?.message}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mt: 1, fontWeight: 'bold' }}>Datos de la Empresa</Typography>
                <Typography variant="caption" color="text.secondary">Estos datos aparecerán en tus facturas</Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  required 
                  fullWidth 
                  label="NIT / Documento"
                  {...register('nit')}
                  error={!!errors.nit} 
                  helperText={errors.nit?.message}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required 
                  fullWidth 
                  label="Razón Social"
                  {...register('businessName')}
                  error={!!errors.businessName} 
                  helperText={errors.businessName?.message}
                />
              </Grid>
            </Grid>

            <Button
              type="submit" 
              fullWidth 
              variant="contained" 
              size="large"
              sx={{ mt: 4, mb: 2, height: 48, fontWeight: 'bold' }} 
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Registrarse'}
            </Button>
            
            <Grid container justifyContent="center">
              <Grid item>
                <Link component={RouterLink} to="/login" variant="body2" underline="hover">
                  ¿Ya tienes una cuenta? Inicia sesión
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
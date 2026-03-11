import { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Paper, 
  Container, 
  Alert, 
  Link, 
  CircularProgress 
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { API_CONFIG } from '../config/api';

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    company?: {
      plan: string;
    };
  };
}

export const Login = () => {
  const { register, handleSubmit } = useForm<LoginFormData>();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const successMessage = location.state?.success;

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas');
      }

      const responseData: LoginResponse = await response.json();
      
      login(responseData.access_token, responseData.user);
      navigate('/dashboard');
    } catch (err) {
      setError('Credenciales incorrectas. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, width: '100%', display: 'flex', flexDirection: 'column', gap: 2, borderRadius: 2 }}>
          <Box textAlign="center">
            <Typography component="h1" variant="h4" fontWeight="800" color="primary">
              SmartBiz
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Inicia sesión en tu panel de control
            </Typography>
          </Box>
          
          {successMessage && <Alert severity="success">{successMessage}</Alert>}
          {error && <Alert severity="error">{error}</Alert>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <TextField
              margin="normal" 
              required 
              fullWidth 
              label="Correo Electrónico" 
              autoFocus
              type="email"
              {...register('email')}
            />
            <TextField
              margin="normal" 
              required 
              fullWidth 
              label="Contraseña" 
              type="password"
              {...register('password')}
            />

            <Button
              type="submit" 
              fullWidth 
              variant="contained" 
              size="large"
              sx={{ mt: 3, mb: 2, height: 48, fontWeight: 'bold' }} 
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Ingresar'}
            </Button>
            
            <Box textAlign="center">
              <Link component={RouterLink} to="/register" variant="body2" underline="hover">
                ¿No tienes cuenta? Regístrate aquí
              </Link>
            </Box>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};
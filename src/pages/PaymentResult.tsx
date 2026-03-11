import { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Button, Paper } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { API_CONFIG } from '../config/api';

export const PaymentResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const calledRef = useRef(false);

  useEffect(() => {
    const verifyPayment = async () => {
      const transactionId = searchParams.get('id');
      if (!transactionId || calledRef.current) return;
      
      calledRef.current = true;

      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_CONFIG.BASE_URL}/payments/confirm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ transactionId })
        });

        if (res.ok) {
          const data = await res.json();
          // Actualizamos el usuario en localStorage para reflejar el nuevo plan inmediatamente
          const userStr = localStorage.getItem('user');
          if (userStr) {
            const user = JSON.parse(userStr);
            if (user.company) user.company.plan = data.plan;
            localStorage.setItem('user', JSON.stringify(user));
          }
          setStatus('success');
        } else {
          setStatus('error');
        }
      } catch (error) {
        setStatus('error');
      }
    };

    verifyPayment();
  }, [searchParams]);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Paper sx={{ p: 6, textAlign: 'center', maxWidth: 500, borderRadius: 4 }}>
        {status === 'loading' && (
          <>
            <CircularProgress size={60} sx={{ mb: 3 }} />
            <Typography variant="h6">Verificando tu pago...</Typography>
            <Typography color="text.secondary">Por favor espera un momento.</Typography>
          </>
        )}

        {status === 'success' && (
          <>
            <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom>¡Pago Exitoso!</Typography>
            <Typography paragraph>
              Tu plan ha sido actualizado correctamente. Ahora puedes disfrutar de todos los beneficios.
            </Typography>
            <Button 
              variant="contained" 
              size="large" 
              onClick={() => { window.location.href = '/dashboard'; }}
              sx={{ mt: 2 }}
            >
              Volver al Dashboard
            </Button>
          </>
        )}

        {status === 'error' && (
          <>
            <ErrorIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
            <Typography variant="h4" fontWeight="bold" gutterBottom>Hubo un problema</Typography>
            <Typography paragraph>
              No pudimos verificar tu pago o la transacción fue rechazada. Por favor contacta a soporte si crees que es un error.
            </Typography>
            <Button 
              variant="outlined" 
              size="large" 
              onClick={() => navigate('/dashboard/pricing')}
              sx={{ mt: 2 }}
            >
              Intentar de nuevo
            </Button>
          </>
        )}
      </Paper>
    </Box>
  );
};
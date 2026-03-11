import { useState } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  CardActions, 
  Button, 
  Grid, 
  CircularProgress,
  Snackbar,
  Alert,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import { API_CONFIG } from '../config/api';

const plans = [
  {
    id: 'FREE',
    title: 'Gratis',
    price: 0,
    features: [
      '5 Facturas al mes',
      'Reportes Básicos',
      'Soporte por Correo'
    ],
    buttonText: 'Tu Plan Actual',
    disabled: true,
    recommended: false
  },
  {
    id: 'STARTER',
    title: 'Emprendedor',
    price: 19900, 
    features: [
      '30 Facturas al mes',
      'Certificado Digital Incluido',
      'Personalización de Logo',
      'Soporte Prioritario'
    ],
    buttonText: 'Elegir Emprendedor',
    disabled: false,
    recommended: false
  },
  {
    id: 'PRO',
    title: 'Empresarial',
    price: 59900,
    features: [
      'Facturas Ilimitadas',
      'Asistente IA (SmartBiz Bot)',
      'Acceso a API',
      'Múltiples Usuarios',
      'Soporte 24/7'
    ],
    buttonText: 'Elegir Empresarial',
    disabled: false,
    recommended: true
  }
];

export const Pricing = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePurchase = async (planId: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const res = await fetch(`${API_CONFIG.BASE_URL}/payments/wompi-params/${planId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Error al conectar con pagos');
      
      const data = await res.json();

      const checkout = new (window as any).WidgetCheckout({
        currency: 'COP',
        amountInCents: data.amountInCents,
        reference: data.reference,
        publicKey: data.publicKey, 
        signature: { integrity: data.signature }, 
        redirectUrl: `${window.location.origin}/dashboard/payment-result`,
      });

      checkout.open((result: any) => {
        const transaction = result.transaction;
        if (transaction.status === 'APPROVED') {
             window.location.href = `/dashboard/payment-result?id=${transaction.id}`;
        }
      });

    } catch (err) {
      setError('Error iniciando la pasarela de pagos.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxWidth="lg" mx="auto" py={6} px={2}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h3" component="h1" fontWeight="800" gutterBottom>
          Planes Flexibles
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Elige el plan perfecto para escalar tu negocio
        </Typography>
      </Box>

      <Grid container spacing={4} alignItems="flex-start" justifyContent="center">
        {plans.map((plan) => (
          <Grid item key={plan.id} xs={12} md={4}>
            <Card 
              elevation={plan.recommended ? 8 : 2}
              sx={{ 
                borderRadius: 4,
                position: 'relative',
                border: plan.recommended ? '2px solid #1976d2' : '1px solid #e0e0e0',
                transform: plan.recommended ? 'scale(1.05)' : 'none',
                height: '100%'
              }}
            >
              {plan.recommended && (
                <Chip 
                  icon={<StarIcon sx={{ color: 'white !important' }} />}
                  label="RECOMENDADO" 
                  color="primary" 
                  sx={{ 
                    position: 'absolute', 
                    top: 16, 
                    right: 16, 
                    fontWeight: 'bold',
                    px: 1
                  }} 
                />
              )}
              <CardContent sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
                  {plan.title}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', my: 2 }}>
                  <Typography variant="h3" fontWeight="800" color="text.primary">
                    ${plan.price.toLocaleString('es-CO')}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" sx={{ ml: 1 }}>
                    /mes
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 3 }} />
                
                <List dense>
                  {plan.features.map((feature, idx) => (
                    <ListItem key={idx} disableGutters>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary={feature} primaryTypographyProps={{ variant: 'body1' }} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
              <CardActions sx={{ p: 3, pt: 0 }}>
                <Button 
                  fullWidth 
                  variant={plan.recommended ? 'contained' : 'outlined'} 
                  size="large"
                  disabled={plan.disabled || loading}
                  onClick={() => handlePurchase(plan.id)}
                  sx={{ py: 1.5, borderRadius: 2, fontWeight: 'bold', textTransform: 'none', fontSize: '1rem' }}
                >
                  {loading && !plan.disabled ? <CircularProgress size={24} color="inherit" /> : plan.buttonText}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')}>
        <Alert severity="error" variant="filled" sx={{ width: '100%' }}>{error}</Alert>
      </Snackbar>
    </Box>
  );
};
import { 
  Box, 
  Button, 
  Container, 
  Grid, 
  Typography, 
  AppBar, 
  Toolbar, 
  Paper,
  Stack,
  Card,
  CardContent,
  CardActions,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import SecurityIcon from '@mui/icons-material/Security';
import BoltIcon from '@mui/icons-material/Bolt';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';

export const Landing = () => {
  const navigate = useNavigate();

  const scrollToPricing = () => {
    const section = document.getElementById('pricing-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const tiers = [
    {
      title: 'Gratis',
      price: '0',
      description: ['5 facturas al mes', '1 usuario', 'Soporte por correo', 'Sin tarjeta de crédito'],
      buttonText: 'Empezar Gratis',
      buttonVariant: 'outlined' as const,
    },
    {
      title: 'Emprendedor',
      subheader: 'MÁS POPULAR',
      price: '19.900',
      description: ['30 facturas al mes', 'Sin publicidad', 'Soporte prioritario', 'Personalización de Logo', 'Acceso a App Móvil'],
      buttonText: 'Prueba Gratis 15 días',
      buttonVariant: 'contained' as const,
      recommended: true
    },
    {
      title: 'Pro AI',
      price: '39.900',
      description: ['Facturas Ilimitadas', 'Asistente IA (Gemini)', 'API de integración', 'Soporte VIP 24/7', 'Múltiples Usuarios'],
      buttonText: 'Elegir Pro',
      buttonVariant: 'contained' as const,
    },
  ];

  return (
    <Box sx={{ bgcolor: '#ffffff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Navbar Section */}
      <AppBar position="sticky" elevation={0} sx={{ 
        bgcolor: 'rgba(255, 255, 255, 0.95)', 
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #eaeaea',
        py: 1 // Un poco más de padding vertical para el logo grande
      }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            {/* Logo SmartBiz Aumentado */}
            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', height: 70 }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
               <img 
                 src="/logo-smartbiz.png" 
                 alt="SmartBiz Logo" 
                 style={{ height: '100%', objectFit: 'contain' }} 
               />
            </Box>
            <Box>
              <Button sx={{ color: '#555', fontWeight: 600, mr: 1 }} onClick={() => navigate('/login')}>
                Ingresar
              </Button>
              <Button 
                variant="contained" 
                onClick={() => navigate('/register')}
                sx={{ 
                  bgcolor: '#1565c0', 
                  fontWeight: 'bold',
                  boxShadow: '0 4px 14px 0 rgba(21, 101, 192, 0.39)',
                  '&:hover': { bgcolor: '#0d47a1' }
                }}
              >
                Comenzar
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ 
        pt: 15, 
        pb: 12, 
        background: 'linear-gradient(135deg, #0d47a1 0%, #1976d2 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decorations */}
        <Box sx={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)' }} />
        <Box sx={{ position: 'absolute', bottom: -50, left: -50, width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.05)' }} />

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <Chip 
            label="🚀 Nueva Integración con IA Gemini" 
            sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 'bold', mb: 3 }} 
          />
          <Typography component="h1" variant="h2" align="center" sx={{ fontWeight: 800, lineHeight: 1.2, mb: 2 }}>
            Facturación Electrónica <br />
            <span style={{ color: '#90caf9' }}>Sin Dolores de Cabeza</span>
          </Typography>
          <Typography variant="h5" align="center" sx={{ color: 'rgba(255,255,255,0.8)', mb: 5, maxWidth: '800px', mx: 'auto', lineHeight: 1.5 }}>
            Cumple con la DIAN en segundos, cobra más rápido y deja que nuestra Inteligencia Artificial organice tus finanzas.
          </Typography>
          <Stack sx={{ pt: 2 }} direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button 
              variant="contained" 
              size="large" 
              onClick={() => navigate('/register')}
              sx={{ 
                bgcolor: 'white', 
                color: '#1565c0', 
                fontWeight: 'bold', 
                px: 4, py: 1.5, 
                fontSize: '1.1rem',
                '&:hover': { bgcolor: '#f5f5f5' }
              }}
            >
              Crear Factura Gratis
            </Button>
            <Button 
              variant="outlined" 
              size="large" 
              onClick={scrollToPricing}
              sx={{ 
                color: 'white', 
                borderColor: 'white', 
                borderWidth: 2,
                fontWeight: 'bold', 
                px: 4, py: 1.5, 
                fontSize: '1.1rem',
                '&:hover': { borderWidth: 2, borderColor: '#e3f2fd', bgcolor: 'rgba(255,255,255,0.1)' }
              }}
            >
              Ver Planes
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Features Section */}
      <Container sx={{ py: 10 }} maxWidth="lg">
        <Grid container spacing={4} justifyContent="center">
          {[
            { 
              icon: <BoltIcon sx={{ fontSize: 40, color: '#ff9800' }} />, 
              title: 'Velocidad Rayo', 
              desc: 'Emite facturas y notas crédito validadas por la DIAN en menos de 5 segundos.' 
            },
            { 
              icon: <SmartToyIcon sx={{ fontSize: 40, color: '#9c27b0' }} />, 
              title: 'Asistente IA', 
              desc: 'Pregúntale a Gemini: "¿Cuánto vendí la semana pasada?" o "Redacta un correo de cobro".' 
            },
            { 
              icon: <SecurityIcon sx={{ fontSize: 40, color: '#4caf50' }} />, 
              title: 'Seguridad Bancaria', 
              desc: 'Tus datos están encriptados. Cumplimos con todas las normas de la DIAN y Habeas Data.' 
            }
          ].map((feature, index) => (
            <Grid item key={index} xs={12} md={4}>
              <Paper elevation={0} sx={{ 
                p: 4, 
                height: '100%', 
                border: '1px solid #f0f0f0', 
                borderRadius: 4, 
                textAlign: 'center',
                transition: 'all 0.3s ease',
                '&:hover': { 
                  transform: 'translateY(-10px)', 
                  boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
                  borderColor: 'transparent'
                }
              }}>
                <Box sx={{ 
                  mb: 2, 
                  display: 'inline-flex', 
                  p: 2, 
                  borderRadius: '50%', 
                  bgcolor: '#fafafa' 
                }}>
                  {feature.icon}
                </Box>
                <Typography variant="h6" fontWeight="bold" gutterBottom>{feature.title}</Typography>
                <Typography color="text.secondary" lineHeight={1.6}>{feature.desc}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Pricing Section */}
      <Box id="pricing-section" sx={{ py: 10, bgcolor: '#f8fafc' }}>
        <Container maxWidth="lg">
          <Typography variant="h6" align="center" color="primary" gutterBottom sx={{ fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: 1 }}>
            Precios Transparentes
          </Typography>
          <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 800, mb: 1, color: '#1e293b' }}>
            Elige el plan ideal para ti
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 8, maxWidth: 600, mx: 'auto' }}>
            Sin contratos forzosos. Cancela cuando quieras.
          </Typography>
          
          <Grid container spacing={4} alignItems="flex-end" justifyContent="center">
            {tiers.map((tier) => (
              <Grid item key={tier.title} xs={12} md={4}>
                <Card sx={{ 
                    borderRadius: 4,
                    position: 'relative',
                    overflow: 'visible',
                    border: tier.recommended ? '2px solid #1565c0' : '1px solid #e2e8f0',
                    boxShadow: tier.recommended ? '0 25px 50px -12px rgba(0, 0, 0, 0.25)' : 'none',
                    transform: tier.recommended ? { md: 'scale(1.05)' } : 'none',
                    zIndex: tier.recommended ? 2 : 1,
                    bgcolor: 'white'
                }}>
                  {tier.recommended && (
                    <Chip 
                      label="MÁS POPULAR" 
                      color="primary" 
                      icon={<StarIcon sx={{ fontSize: '16px !important' }} />}
                      sx={{ 
                        position: 'absolute', 
                        top: -16, 
                        left: '50%', 
                        transform: 'translateX(-50%)',
                        fontWeight: 'bold',
                        px: 2
                      }} 
                    />
                  )}
                  
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom fontWeight="bold">
                      {tier.title}
                    </Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'baseline', mb: 2 }}>
                      <Typography component="h2" variant="h3" color="text.primary" fontWeight="800">
                        ${tier.price}
                      </Typography>
                      {tier.price !== '0' && (
                        <Typography variant="h6" color="text.secondary">/mes</Typography>
                      )}
                    </Box>
                    
                    <List sx={{ mb: 2 }}>
                      {tier.description.map((line) => (
                        <ListItem key={line} disableGutters sx={{ py: 1 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckCircleIcon color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={line} primaryTypographyProps={{ fontSize: '0.95rem', color: '#475569' }} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                  
                  <CardActions sx={{ p: 4, pt: 0 }}>
                    <Button 
                      fullWidth 
                      size="large"
                      variant={tier.buttonVariant} 
                      color="primary"
                      onClick={() => navigate('/register')}
                      sx={{ 
                        py: 1.5, 
                        fontWeight: 'bold',
                        boxShadow: tier.recommended ? '0 10px 15px -3px rgba(21, 101, 192, 0.3)' : 'none'
                      }}
                    >
                      {tier.buttonText}
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer Section */}
      <Box sx={{ bgcolor: '#0f172a', color: 'white', py: 8, mt: 'auto' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="space-between">
            <Grid item xs={12} md={5}>
              {/* SmartBiz Logo REMOVED from here */}
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>Sobre Nosotros</Typography>
              <Typography variant="body2" color="grey.400" lineHeight={1.8}>
                La plataforma todo-en-uno para que los emprendedores colombianos gestionen su facturación sin estrés. Tecnología de punta al alcance de todos.
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 'bold', mb: 3, textTransform: 'uppercase' }}>Producto</Typography>
              <Stack spacing={1.5}>
                <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>Características</Typography>
                <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }} onClick={scrollToPricing}>Precios</Typography>
                <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>API para Desarrolladores</Typography>
              </Stack>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 'bold', mb: 3, textTransform: 'uppercase' }}>Legal</Typography>
              <Stack spacing={1.5}>
                <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>Términos y Condiciones</Typography>
                <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>Política de Privacidad</Typography>
                <Typography variant="body2" color="grey.400" sx={{ cursor: 'pointer', '&:hover': { color: 'white' } }}>Contacto</Typography>
              </Stack>
            </Grid>
          </Grid>

          <Box sx={{ borderTop: '1px solid #1e293b', mt: 8, pt: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            {/* BackerDevs Logo Section */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, opacity: 0.9 }}>
              <Typography variant="caption" color="grey.500">
                Created by
              </Typography>
              <img 
                src="/logo-backerdevs.png" 
                alt="BackerDevs Logo" 
                style={{ height: '80px', objectFit: 'contain' }} 
              />
            </Box>
            <Typography variant="caption" color="grey.600">
              © {new Date().getFullYear()} BackerDevs. Todos los derechos reservados.
            </Typography>
          </Box>
        </Container>
      </Box>

    </Box>
  );
};
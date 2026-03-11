import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, CircularProgress } from '@mui/material';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar 
} from 'recharts';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptIcon from '@mui/icons-material/Receipt';

export const Dashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        // Llamadas al backend (URLs directas para evitar errores de config)
        const [statsRes, chartsRes] = await Promise.all([
          fetch('http://localhost:3000/dashboard/stats', { headers }),
          fetch('http://localhost:3000/dashboard/charts', { headers })
        ]);

        if (statsRes.ok && chartsRes.ok) {
          const statsData = await statsRes.json();
          const chartsData = await chartsRes.json();
          setStats(statsData);
          setChartData(chartsData.salesHistory || []);
        }
      } catch (error) {
        console.error("Error cargando dashboard", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Box p={4} display="flex" justifyContent="center"><CircularProgress /></Box>;

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" gutterBottom mb={4}>Resumen de Negocio</Typography>

      {/* TARJETAS DE KPI */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 150, justifyContent: 'center' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
               <Typography color="text.secondary">Ventas Totales</Typography>
               <AttachMoneyIcon color="success" />
            </Box>
            <Typography variant="h4" fontWeight="bold">
              ${stats?.totalSales?.toLocaleString('es-CO') || '0'}
            </Typography>
            <Typography variant="caption" color="success.main" display="flex" alignItems="center">
              <TrendingUpIcon fontSize="small" sx={{ mr: 0.5 }} /> +12% vs mes anterior
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 150, justifyContent: 'center' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
               <Typography color="text.secondary">Facturas Emitidas</Typography>
               <ReceiptIcon color="primary" />
            </Box>
            <Typography variant="h4" fontWeight="bold">
              {stats?.invoiceCount || 0}
            </Typography>
            <Typography variant="caption" color="text.secondary">Este mes</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, display: 'flex', flexDirection: 'column', height: 150, justifyContent: 'center' }}>
            <Box display="flex" justifyContent="space-between" alignItems="center">
               <Typography color="text.secondary">Impuestos Recaudados</Typography>
               <AttachMoneyIcon color="warning" />
            </Box>
            <Typography variant="h4" fontWeight="bold">
              ${stats?.totalTax?.toLocaleString('es-CO') || '0'}
            </Typography>
            <Typography variant="caption" color="text.secondary">IVA Acumulado</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* GRÁFICOS (Aquí estaba el error de los cuadrados negros) */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}> {/* HEIGHT FIJO OBLIGATORIO */}
            <Typography variant="h6" gutterBottom>Comportamiento de Ventas</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                <Area type="monotone" dataKey="ventas" stroke="#1976d2" fill="#90caf9" />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}> {/* HEIGHT FIJO OBLIGATORIO */}
            <Typography variant="h6" gutterBottom>Comparativa Mensual</Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
                <Bar dataKey="ventas" fill="#1976d2" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
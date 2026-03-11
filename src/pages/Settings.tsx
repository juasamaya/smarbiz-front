import { useState } from 'react';
import { Box, Button, TextField, Typography, Paper, Alert, Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import { apiClient } from '../api/axios.client';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SaveIcon from '@mui/icons-material/Save';

export const Settings = () => {
  const { register, handleSubmit } = useForm();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setMsg({ type: '', text: '' });

    const formData = new FormData();
    formData.append('password', data.password);
    
    // Solo agregamos el archivo si el usuario seleccionó uno nuevo
    if (data.certificate && data.certificate.length > 0) {
      formData.append('certificate', data.certificate[0]);
    }

    try {
      await apiClient.put('/company/settings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMsg({ type: 'success', text: 'Configuración guardada correctamente.' });
    } catch (err: any) {
      console.error(err);
      setMsg({ type: 'error', text: 'Error al guardar la configuración.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">Configuración de Empresa</Typography>
      <Paper sx={{ p: 4, mt: 3, maxWidth: 600 }}>
        <Typography variant="h6" gutterBottom>Certificado Digital (Firma Electrónica)</Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Sube tu archivo .p12 para poder firmar facturas ante la DIAN.
        </Typography>

        {msg.text && <Alert severity={msg.type as any} sx={{ mb: 2 }}>{msg.text}</Alert>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<UploadFileIcon />}
                sx={{ height: 56 }}
              >
                Seleccionar Archivo .p12
                <input
                  type="file"
                  hidden
                  accept=".p12,.pfx"
                  {...register('certificate')}
                />
              </Button>
              <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                * Solo archivos .p12 o .pfx
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Contraseña del Certificado"
                type="password"
                helperText="Escribe la contraseña para desencriptar el archivo"
                {...register('password')}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<SaveIcon />}
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Configuración'}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};
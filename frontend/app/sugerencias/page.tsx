'use client';

import { useState } from 'react';
import { createSugerencia } from '@/lib/api';
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Snackbar,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import SendIcon from '@mui/icons-material/Send';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const MotionCard = motion(Card);

interface FormData {
  nombre: string;
  email: string;
  libro_sugerido: string;
  autor_sugerido: string;
  razon: string;
}

export default function SugerenciasPage() {
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await createSugerencia(data);
      toast.success('¡Gracias por tu sugerencia! La hemos recibido correctamente.');
      setShowSuccess(true);
      reset();
      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      toast.error('Error al enviar la sugerencia. Intenta nuevamente.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box textAlign="center" mb={6} data-aos="fade-down">
        <Box display="flex" justifyContent="center" mb={2}>
          <Box
            sx={{
              width: 100,
              height: 100,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.2)',
            }}
          >
            <LightbulbIcon sx={{ fontSize: 60, color: 'white' }} />
          </Box>
        </Box>
        <Typography
          variant="h3"
          gutterBottom
          fontWeight={700}
          sx={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Sugiere un Libro
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Comparte tus recomendaciones con nuestra comunidad
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid xs={12} md={8}>
          <MotionCard
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CardContent sx={{ p: 4 }}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                  <Grid xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Tu Nombre"
                      {...register('nombre', { required: 'El nombre es requerido' })}
                      error={!!errors.nombre}
                      helperText={errors.nombre?.message}
                      disabled={loading}
                    />
                  </Grid>

                  <Grid xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Tu Email"
                      type="email"
                      {...register('email', { 
                        required: 'El email es requerido',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Email inválido'
                        }
                      })}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      disabled={loading}
                    />
                  </Grid>

                  <Grid xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Título del Libro"
                      {...register('libro_sugerido', { required: 'El título es requerido' })}
                      error={!!errors.libro_sugerido}
                      helperText={errors.libro_sugerido?.message}
                      disabled={loading}
                    />
                  </Grid>

                  <Grid xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Autor del Libro"
                      {...register('autor_sugerido', { required: 'El autor es requerido' })}
                      error={!!errors.autor_sugerido}
                      helperText={errors.autor_sugerido?.message}
                      disabled={loading}
                    />
                  </Grid>

                  <Grid xs={12}>
                    <TextField
                      fullWidth
                      label="¿Por qué recomiendas este libro?"
                      multiline
                      rows={4}
                      {...register('razon', { 
                        required: 'Por favor cuéntanos por qué lo recomiendas',
                        minLength: {
                          value: 20,
                          message: 'Por favor escribe al menos 20 caracteres'
                        }
                      })}
                      error={!!errors.razon}
                      helperText={errors.razon?.message}
                      disabled={loading}
                    />
                  </Grid>

                  <Grid xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      fullWidth
                      disabled={loading}
                      endIcon={<SendIcon />}
                      sx={{
                        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        fontWeight: 700,
                        py: 1.5,
                        '&:hover': {
                          background: 'linear-gradient(135deg, #f5576c 0%, #f093fb 100%)',
                        },
                      }}
                    >
                      {loading ? 'Enviando...' : 'Enviar Sugerencia'}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </MotionCard>
        </Grid>

        <Grid item xs={12} md={4}>
          <MotionCard
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom fontWeight={700}>
                ¿Tienes más ideas?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Nos encanta conocer nuevas lecturas. Si tienes una lista o recursos,
                compártelos y los revisaremos para incluirlos en la colección.
              </Typography>
            </CardContent>
          </MotionCard>
        </Grid>
      </Grid>

      <Snackbar
        open={showSuccess}
        autoHideDuration={5000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setShowSuccess(false)}
          severity="success"
          sx={{ width: '100%' }}
          icon={<CheckCircleIcon />}
        >
          ¡Gracias! Tu sugerencia fue enviada correctamente.
        </Alert>
      </Snackbar>
    </Container>
  );
}


// nuevos datos se instalara aqui
// hola a todos
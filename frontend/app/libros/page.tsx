'use client';

import { useEffect, useState } from 'react';
import { getLibros, Libro } from '@/lib/api';
import { 
  Container, 
  
  Card, 
  CardContent, 
  Typography, 
  Box, 
  CircularProgress,
  Chip,
  TextField,
  InputAdornment,
  Alert,
  Skeleton,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { motion, AnimatePresence } from 'framer-motion';
import SearchIcon from '@mui/icons-material/Search';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import PersonIcon from '@mui/icons-material/Person';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const MotionCard = motion(Card);

export default function LibrosPage() {
  const [libros, setLibros] = useState<Libro[]>([]);
  const [filteredLibros, setFilteredLibros] = useState<Libro[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchLibros = async () => {
      try {
        const data = await getLibros();
        setLibros(data);
        setFilteredLibros(data);
      } catch (err) {
        setError('Error al cargar los libros. Verifica que el backend esté corriendo.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLibros();
  }, []);

  useEffect(() => {
    const filtered = libros.filter(libro => 
      libro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      libro.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      libro.genero.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLibros(filtered);
  }, [searchTerm, libros]);

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h3" gutterBottom fontWeight={700} mb={4}>
          Catálogo de Libros
        </Typography>
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <Grid xs={12} sm={6} md={4} key={n}>
              <Card>
                <CardContent>
                  <Skeleton variant="text" height={40} />
                  <Skeleton variant="text" height={30} />
                  <Skeleton variant="rectangular" height={100} sx={{ mt: 2 }} />
                  <Skeleton variant="text" height={30} sx={{ mt: 2 }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      // nuevo cambio henry
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box mb={4} data-aos="fade-down">
        <Typography 
          variant="h3" 
          gutterBottom 
          fontWeight={700}
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Catálogo de Libros
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Descubre tu próxima gran lectura
        </Typography>

        <TextField
          fullWidth
          placeholder="Buscar por título, autor o género..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mt: 3, maxWidth: 600 }}
        />
      </Box>

      {filteredLibros.length === 0 ? (
        <Box textAlign="center" py={8} data-aos="fade-up">
          <AutoStoriesIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary">
            {searchTerm ? 'No se encontraron libros con ese criterio' : 'No hay libros disponibles'}
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          <AnimatePresence>
            {filteredLibros.map((libro, index) => (
              <Grid xs={12} sm={6} md={4} key={libro.id}>
                <MotionCard
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ 
                    scale: 1.03,
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                  }}
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    overflow: 'visible',
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -10,
                      right: -10,
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.3)',
                      zIndex: 1,
                    }}
                  >
                    <AutoStoriesIcon sx={{ color: 'white', fontSize: 28 }} />
                  </Box>

                  <CardContent sx={{ flexGrow: 1, pt: 4 }}>
                    <Typography variant="h5" gutterBottom fontWeight={700} color="primary">
                      {libro.titulo}
                    </Typography>

                    <Box display="flex" alignItems="center" gap={1} mb={2}>
                      <PersonIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                      <Typography variant="body2" color="text.secondary" fontWeight={600}>
                        {libro.autor}
                      </Typography>
                    </Box>

                    <Typography variant="body2" color="text.secondary" paragraph sx={{ minHeight: 60 }}>
                      {libro.descripcion}
                    </Typography>

                    <Box display="flex" gap={1} flexWrap="wrap" mt={2}>
                      <Chip 
                        label={libro.genero} 
                        size="small" 
                        color="secondary"
                        sx={{ fontWeight: 600 }}
                      />
                      <Chip 
                        icon={<CalendarTodayIcon sx={{ fontSize: 16 }} />}
                        label={libro.año_publicacion} 
                        size="small" 
                        variant="outlined"
                      />
                    </Box>
                  </CardContent>
                </MotionCard>
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      )}
    </Container>
  );
}



// hola como estas?
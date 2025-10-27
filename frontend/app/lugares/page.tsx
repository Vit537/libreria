'use client';

import { useEffect, useState } from 'react';
import { getLugares, Lugar } from '@/lib/api';
import {
  Container,
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Tabs,
  Tab,
  Alert,
  Skeleton,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import LanguageIcon from '@mui/icons-material/Language';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalLibraryIcon from '@mui/icons-material/LocalLibrary';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const MotionCard = motion(Card);

export default function LugaresPage() {
  const [lugares, setLugares] = useState<Lugar[]>([]);
  const [filteredLugares, setFilteredLugares] = useState<Lugar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedTab, setSelectedTab] = useState(0);

  const tipos = ['todos', 'libreria', 'biblioteca', 'online'];
  const tipoLabels = ['Todos', 'Librerías', 'Bibliotecas', 'Tiendas Online'];
  const tipoIcons = [null, StorefrontIcon, LocalLibraryIcon, ShoppingCartIcon];

  useEffect(() => {
    const fetchLugares = async () => {
      try {
        const data = await getLugares();
        setLugares(data);
        setFilteredLugares(data);
      } catch (err) {
        setError('Error al cargar los lugares. Verifica que el backend esté corriendo.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLugares();
  }, []);

  useEffect(() => {
    if (selectedTab === 0) {
      setFilteredLugares(lugares);
    } else {
      const tipo = tipos[selectedTab];
      setFilteredLugares(lugares.filter(lugar => lugar.tipo === tipo));
    }
  }, [selectedTab, lugares]);

  const getTipoColor = (tipo: string) => {
    switch (tipo) {
      case 'libreria': return { bg: '#667eea', icon: StorefrontIcon };
      case 'biblioteca': return { bg: '#f093fb', icon: LocalLibraryIcon };
      case 'online': return { bg: '#4facfe', icon: ShoppingCartIcon };
      default: return { bg: '#6b7280', icon: LocationOnIcon };
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg">
        <Typography variant="h3" gutterBottom fontWeight={700} mb={4}>
          Dónde Obtener Libros
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          }}
        >
          {[1, 2, 3].map((n) => (
            <Card key={n}>
              <CardContent>
                <Skeleton variant="circular" width={60} height={60} />
                <Skeleton variant="text" height={40} sx={{ mt: 2 }} />
                <Skeleton variant="rectangular" height={80} sx={{ mt: 2 }} />
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error">{error}</Alert>
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
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Dónde Obtener Libros
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Encuentra el lugar perfecto para conseguir tu próxima lectura
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mt: 3 }}>
          <Tabs 
            value={selectedTab} 
            onChange={(e, newValue) => setSelectedTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {tipoLabels.map((label, index) => {
              const Icon = tipoIcons[index];
              return (
                <Tab
                  key={label}
                  label={label}
                  icon={Icon ? <Icon /> : undefined}
                  iconPosition="start"
                  sx={{ fontWeight: 600 }}
                />
              );
            })}
          </Tabs>
        </Box>
      </Box>

      {filteredLugares.length === 0 ? (
        <Box textAlign="center" py={8} data-aos="fade-up">
          <LocationOnIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" color="text.secondary">
            No hay lugares disponibles en esta categoría
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
          }}
        >
          <AnimatePresence mode="wait">
            {filteredLugares.map((lugar, index) => {
              const tipoInfo = getTipoColor(lugar.tipo);
              const IconComponent = tipoInfo.icon;

              return (
                <MotionCard
                  key={lugar.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{
                    scale: 1.03,
                    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                  }}
                  sx={{ height: '100%', position: 'relative', overflow: 'visible' }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -20,
                      right: 20,
                      width: 70,
                      height: 70,
                      borderRadius: '50%',
                      background: tipoInfo.bg,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.3)',
                      zIndex: 1,
                    }}
                  >
                    <IconComponent sx={{ color: 'white', fontSize: 36 }} />
                  </Box>

                  <CardContent sx={{ pt: 5 }}>
                    <Box mb={2}>
                      <Chip
                        label={lugar.tipo_display || lugar.tipo}
                        size="small"
                        sx={{
                          bgcolor: tipoInfo.bg,
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    </Box>

                    <Typography variant="h5" gutterBottom fontWeight={700} color="primary">
                      {lugar.nombre}
                    </Typography>

                    <Box display="flex" alignItems="flex-start" gap={1} mb={1.5}>
                      <LocationOnIcon sx={{ fontSize: 20, color: 'text.secondary', mt: 0.3 }} />
                      <Typography variant="body2" color="text.secondary">
                        {lugar.direccion}
                      </Typography>
                    </Box>

                    {lugar.telefono && (
                      <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                        <PhoneIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {lugar.telefono}
                        </Typography>
                      </Box>
                    )}

                    {lugar.horario && (
                      <Box display="flex" alignItems="center" gap={1} mb={1.5}>
                        <AccessTimeIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {lugar.horario}
                        </Typography>
                      </Box>
                    )}

                    {lugar.sitio_web && (
                      <Box display="flex" alignItems="center" gap={1} mt={2}>
                        <IconButton
                          size="small"
                          href={lugar.sitio_web}
                          target="_blank"
                          sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            '&:hover': { bgcolor: 'primary.dark' },
                          }}
                        >
                          <LanguageIcon />
                        </IconButton>
                        <Typography variant="body2" fontWeight={600} color="primary">
                          Visitar sitio web
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </MotionCard>
              );
            })}
          </AnimatePresence>
        </Box>
      )}

      <Card
        sx={{
          mt: 6,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
        }}
        data-aos="fade-up"
      >
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom fontWeight={700}>
            ¿No encuentras lo que buscas?
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Contáctanos y te ayudaremos a encontrar el lugar perfecto para conseguir tus libros
          </Typography>
          <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
            <Chip label="📧 contacto@libreriavirtual.com" sx={{ bgcolor: 'white', fontWeight: 600 }} />
            <Chip label="📱 +591 2-2345678" sx={{ bgcolor: 'white', fontWeight: 600 }} />
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
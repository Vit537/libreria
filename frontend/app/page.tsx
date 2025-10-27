'use client';

import Link from 'next/link';
import { Container, Card, CardContent, Typography, Box, Button } from '@mui/material';
import { motion } from 'framer-motion';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const MotionCard = motion(Card);

export default function Home() {
  const cards = [
    {
      icon: MenuBookIcon,
      title: 'Explora Libros',
      description: 'Descubre nuestra colección de libros de diversos géneros y autores',
      href: '/libros',
      color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    {
      icon: LightbulbIcon,
      title: 'Sugiere Lecturas',
      description: 'Comparte tus recomendaciones y ayuda a otros a encontrar su próxima lectura',
      href: '/sugerencias',
      color: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    },
    {
      icon: LocationOnIcon,
      title: 'Dónde Obtenerlos',
      description: 'Encuentra librerías, bibliotecas y tiendas online para conseguir tus libros',
      href: '/lugares',
      color: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    },
  ];

  const benefits = [
    'Catálogo actualizado constantemente',
    'Recomendaciones de la comunidad',
    'Múltiples opciones de compra',
    'Interfaz fácil de usar',
  ];

  return (
    <Container maxWidth="lg">
      <Box textAlign="center" mb={8} data-aos="fade-down">
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 800,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Bienvenido a Librería Virtual
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
          Tu espacio para descubrir, sugerir y encontrar libros
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gap: 4,
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          mb: 8
        }}
      >
        {cards.map((card, index) => (
          <Box key={card.title} data-aos="fade-up" data-aos-delay={index * 100}>
            <Link href={card.href} style={{ textDecoration: 'none' }}>
              <MotionCard
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                }}
                whileTap={{ scale: 0.98 }}
                sx={{ 
                  height: '100%',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '6px',
                    background: card.color,
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center', p: 4 }}>
                  <Box 
                    sx={{ 
                      background: card.color,
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 24px',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    }}
                  >
                    <card.icon sx={{ fontSize: 40, color: 'white' }} />
                  </Box>
                  <Typography variant="h5" component="h2" gutterBottom fontWeight={700}>
                    {card.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {card.description}
                  </Typography>
                </CardContent>
              </MotionCard>
            </Link>
          </Box>
        ))}
      </Box>

      <Card 
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          p: 4,
        }}
        data-aos="zoom-in"
      >
        <Typography variant="h4" gutterBottom textAlign="center" fontWeight={700}>
          ¿Por qué Librería Virtual?
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
            mt: 2
          }}
        >
          {benefits.map((benefit, index) => (
            <Box key={index}>
              <Box display="flex" alignItems="center" gap={2}>
                <CheckCircleIcon sx={{ fontSize: 32 }} />
                <Typography variant="h6">{benefit}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
        <Box textAlign="center" mt={4}>
          <Link href="/libros" passHref legacyBehavior>
            <Button 
              variant="contained" 
              size="large"
              sx={{ 
                bgcolor: 'white',
                color: 'primary.main',
                fontWeight: 700,
                px: 4,
                '&:hover': {
                  bgcolor: 'grey.100',
                }
              }}
            >
              Comenzar Ahora
            </Button>
          </Link>
        </Box>
      </Card>
    </Container>
  );
}

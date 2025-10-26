// import Image from "next/image";

// export default function Home() {
//   return (
//     <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={100}
//           height={20}
//           priority
//         />
//         <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
//           <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
//             To get started, edit the page.tsx file.
//           </h1>
//           <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
//             Looking for a starting point or more instructions? Head over to{" "}
//             <a
//               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Templates
//             </a>{" "}
//             or the{" "}
//             <a
//               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Learning
//             </a>{" "}
//             center.
//           </p>
//         </div>
//         <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
//           <a
//             className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={16}
//               height={16}
//             />
//             Deploy Now
//           </a>
//           <a
//             className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Documentation
//           </a>
          
//         </div>
//       </main>
//     </div>
//   );
// }


'use client';

import Link from 'next/link';
import { Container, Grid, Card, CardContent, Typography, Box, Button } from '@mui/material';
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

      <Grid container spacing={4} mb={8}>
        {cards.map((card, index) => (
          <Grid item xs={12} md={4} key={card.title} data-aos="fade-up" data-aos-delay={index * 100}>
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
          </Grid>
        ))}
      </Grid>

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
        <Grid container spacing={3} mt={2}>
          {benefits.map((benefit, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Box display="flex" alignItems="center" gap={2}>
                <CheckCircleIcon sx={{ fontSize: 32 }} />
                <Typography variant="h6">{benefit}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
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
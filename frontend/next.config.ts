import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Usar 'export' para generar sitio estático (Cloud Storage)
  // o 'standalone' para servidor Node.js (Cloud Run)
  output: (process.env.NEXT_OUTPUT_MODE === 'standalone' ? 'standalone' : 'export') as 'export' | 'standalone',
  
  // Configuración para producción
  compress: true,
  
  // Requerido para static export
  trailingSlash: true,
  
  // Variables de entorno
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  },
  
  // Desactivar optimización de imágenes para static export
  // (requerido cuando output = 'export')
  images: {
    unoptimized: process.env.NEXT_OUTPUT_MODE !== 'standalone',
  },
  
  // Headers de seguridad (solo para Cloud Run, no aplica a static export)
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  }
};

export default nextConfig;


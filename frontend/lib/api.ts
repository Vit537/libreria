// API para consumir el backend Django

export type Libro = {
  id: number;
  titulo: string;
  autor: string;
  genero: string;
  descripcion?: string;
  año_publicacion?: number | string;
  imagen_url?: string;
};

export type Lugar = {
  id: number;
  nombre: string;
  tipo: string;
  tipo_display?: string;
  direccion: string;
  telefono?: string;
  sitio_web?: string;
  horario?: string;
};

export type Sugerencia = {
  id?: number;
  nombre: string;
  email: string;
  libro_sugerido: string;
  autor_sugerido: string;
  razon: string;
};

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function getLibros(): Promise<Libro[]> {
  const res = await fetch(`${API_URL}/libros/`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Error al obtener libros');
  return res.json();
}

export async function getLugares(): Promise<Lugar[]> {
  const res = await fetch(`${API_URL}/lugares/`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error('Error al obtener lugares');
  return res.json();
}

export async function createSugerencia(data: Sugerencia): Promise<any> {
  const res = await fetch(`${API_URL}/sugerencias/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al enviar sugerencia');
  return res.json();
}

import '@testing-library/jest-dom';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Admin from './Admin';
import { useAuth } from '../../servicios/context/AuthContext';
import { supabase } from '../../lib/supabase';
import servicioProductos from '../../servicios/servicioProductos';

// 1. Mocks de las dependencias (Asegúrate que las rutas sean correctas)
vi.mock('../../servicios/context/AuthContext');
vi.mock('../../lib/supabase');
vi.mock('../../servicios/servicioProductos');

// Mock de useNavigate
const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockedNavigate };
});

describe('Admin Component Tests', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Redirige a /login si no hay usuario logueado', async () => {
    // Simulamos que la carga terminó pero no hay usuario
    useAuth.mockReturnValue({ user: null, loading: false });

    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/login');
    });
  });

  it('Muestra los productos si el usuario es administrador', async () => {
    // 1. Mock de Auth: Usuario logueado
    useAuth.mockReturnValue({ user: { id: 'admin123' }, loading: false });

    // 2. Mock de Supabase: El rol es 'admin'
    // Dentro del bloque de test "Muestra los productos..."
supabase.from.mockReturnValue({
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn().mockResolvedValue({ 
    data: { role: 'admin' }, 
    error: null 
  })
});

    // 3. Mock del Servicio de Productos: Devuelve un producto de prueba
    servicioProductos.getAll.mockResolvedValue({
      data: [{ id: '1', nombre: 'Balón Oficial', precio: 50, url: '', categoria: 'Voley' }]
    });

    render(
      <MemoryRouter>
        <Admin />
      </MemoryRouter>
    );

    // Buscamos el título de la página
    const titulo = await screen.findByText(/Gestión de Productos/i);
    expect(titulo).toBeInTheDocument();

    // Verificamos que el producto aparezca en la tabla
    const producto = await screen.findByText('Balón Oficial');
    expect(producto).toBeInTheDocument();
  });
});
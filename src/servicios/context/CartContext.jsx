import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from './AuthContext';
import { toast } from "react-toastify";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [productos, setProductos] = useState([]);
  const [total, setTotal] = useState(0);

  // 1. CARGAR CARRITO (Híbrido)
  const cargarCarrito = useCallback(async () => {
    if (user) {
      // Si hay usuario, prioridad a Supabase
      const { data, error } = await supabase
        .from('carrito')
        .select('cantidad, datos_producto')
        .eq('user_id', user.id);

      if (!error && data) {
        const formateados = data
          .filter(item => item.datos_producto !== null)
          .map(item => ({
            producto: item.datos_producto,
            cantidad: item.cantidad
          }));
        setProductos(formateados);
      }
    } else {
      // Si no hay usuario, leer de LocalStorage
      const localCart = localStorage.getItem('carrito_invitado');
      if (localCart) {
        setProductos(JSON.parse(localCart));
      }
    }
  }, [user]);

  // 2. EFECTO DE SINCRONIZACIÓN Y CÁLCULO DE TOTAL
  useEffect(() => {
    cargarCarrito();
  }, [user, cargarCarrito]);

  useEffect(() => {
    // Calcular total cada vez que cambien los productos
    const suma = productos.reduce((acc, p) => acc + (p.producto.precio * p.cantidad), 0);
    setTotal(suma);

    // Si no hay usuario, persistir los cambios en LocalStorage
    if (!user) {
      localStorage.setItem('carrito_invitado', JSON.stringify(productos));
    }
  }, [productos, user]);

  // 3. AÑADIR PRODUCTO
  const addProducto = async (producto) => {
    const existe = productos.find(p => p.producto.id === producto.id);
    const nuevaCantidad = existe ? existe.cantidad + 1 : 1;

    const nuevosProductos = existe 
      ? productos.map(p => p.producto.id === producto.id ? { ...p, cantidad: nuevaCantidad } : p)
      : [...productos, { producto, cantidad: 1 }];
    
    setProductos(nuevosProductos);

    // Si el usuario está logueado, sincronizar con Supabase
    if (user) {
      await supabase.from('carrito').upsert({
        user_id: user.id,
        producto_id: producto.id,
        cantidad: nuevaCantidad,
        datos_producto: producto 
      }, { onConflict: 'user_id, producto_id' });
    }

    toast.success(`${producto.nombre} añadido`);
  };

  // 4. ELIMINAR PRODUCTO
  const eliminarDelCarrito = async (id) => {
    const nuevosProductos = productos.filter(p => p.producto.id !== id);
    setProductos(nuevosProductos);

    if (user) {
      await supabase.from('carrito')
        .delete()
        .eq('user_id', user.id)
        .eq('producto_id', id);
    }
    toast.success(`producto eliminado`)
    // Si no hay usuario, el useEffect de arriba ya se encarga de actualizar el LocalStorage
  };

  return (
    <CartContext.Provider value={{ total, productos, addProducto, eliminarDelCarrito }}>
      {children}
    </CartContext.Provider>
  );
};
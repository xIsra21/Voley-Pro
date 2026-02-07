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

  // FUNCIÓN PARA TRAER EL CARRITO DE LA NUBE
  const cargarCarritoDesdeDB = useCallback(async (userId) => {
    const { data, error } = await supabase
      .from('carrito')
      .select('cantidad, datos_producto')
      .eq('user_id', userId);

    if (!error && data) {
      const formateados = data.map(item => ({
        producto: item.datos_producto, // Usamos tu columna JSONB
        cantidad: item.cantidad
      }));
      setProductos(formateados);
      const nuevoTotal = formateados.reduce((acc, p) => acc + (p.producto.precio * p.cantidad), 0);
      setTotal(nuevoTotal);
    }
  }, []);

  // RECARGA AL INICIAR SESIÓN O REFRESCAR F5
  useEffect(() => {
    if (user) {
      cargarCarritoDesdeDB(user.id);
    } else {
      // Al cerrar sesión, se limpia el estado local
      setProductos([]);
      setTotal(0);
    }
  }, [user, cargarCarritoDesdeDB]);

  const addProducto = async (producto) => {
    if (!user) return toast.warning("Inicia sesión para guardar productos");

    const existe = productos.find(p => p.producto.id === producto.id);
    const nuevaCantidad = existe ? existe.cantidad + 1 : 1;

    // 1. Guardar en Supabase (Persistencia real)
    const { error } = await supabase.from('carrito').upsert({
      user_id: user.id,
      producto_id: producto.id,
      cantidad: nuevaCantidad,
      datos_producto: producto 
    }, { onConflict: 'user_id, producto_id' });

    if (!error) {
      // 2. Actualizar UI local
      const nuevosProductos = existe 
        ? productos.map(p => p.producto.id === producto.id ? { ...p, cantidad: nuevaCantidad } : p)
        : [...productos, { producto, cantidad: 1 }];
      
      setProductos(nuevosProductos);
      setTotal(prev => prev + producto.precio);
      toast.success(`${producto.nombre} guardado`);
    }
  };

  const eliminarDelCarrito = async (id) => {
    if (user) {
      await supabase.from('carrito').delete().eq('user_id', user.id).eq('producto_id', id);
      const item = productos.find(p => p.producto.id === id);
      if (item) {
        setTotal(prev => prev - (item.producto.precio * item.cantidad));
        setProductos(productos.filter(p => p.producto.id !== id));
      }
    }
  };

  return (
    <CartContext.Provider value={{ total, productos, addProducto, eliminarDelCarrito }}>
      {children}
    </CartContext.Provider>
  );
};
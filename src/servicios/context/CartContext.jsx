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

  const cargarCarrito = useCallback(async (userId) => {
    // Solo pedimos columnas que EXISTEN en tu tabla carrito según tu imagen
    const { data, error } = await supabase
      .from('carrito')
      .select('cantidad, datos_producto')
      .eq('user_id', userId);

    if (error) return console.error("Error DB:", error.message);

    if (data) {
      // Filtrado de seguridad: si datos_producto es null por algún motivo, lo ignoramos
      const validos = data
        .filter(item => item.datos_producto !== null)
        .map(item => ({
          producto: item.datos_producto,
          cantidad: item.cantidad
        }));

      setProductos(validos);
      const suma = validos.reduce((acc, p) => acc + (p.producto.precio * p.cantidad), 0);
      setTotal(suma);
    }
  }, []);

  useEffect(() => {
    if (user) {
      cargarCarrito(user.id);
    } else {
      setProductos([]);
      setTotal(0);
    }
  }, [user, cargarCarrito]);

  const addProducto = async (producto) => {
    if (!user) return toast.info("Inicia sesión para guardar tu carrito");

    const existe = productos.find(p => p.producto.id === producto.id);
    const nuevaCantidad = existe ? existe.cantidad + 1 : 1;

    // Actualización local rápida
    const nuevos = existe 
      ? productos.map(p => p.producto.id === producto.id ? { ...p, cantidad: nuevaCantidad } : p)
      : [...productos, { producto, cantidad: 1 }];
    
    setProductos(nuevos);
    setTotal(prev => prev + producto.precio);

    // Sincronización con Supabase usando tu columna JSONB
    await supabase.from('carrito').upsert({
      user_id: user.id,
      producto_id: producto.id,
      cantidad: nuevaCantidad,
      datos_producto: producto // Guardamos todo el objeto aquí
    }, { onConflict: 'user_id, producto_id' });

    toast.success("Carrito actualizado");
  };

  const eliminarDelCarrito = async (id) => {
    const item = productos.find(p => p.producto.id === id);
    if (!item) return;

    setTotal(prev => prev - (item.producto.precio * item.cantidad));
    setProductos(productos.filter(p => p.producto.id !== id));

    if (user) {
      await supabase.from('carrito').delete().eq('user_id', user.id).eq('producto_id', id);
    }
  };

  return (
    <CartContext.Provider value={{ total, productos, addProducto, eliminarDelCarrito }}>
      {children}
    </CartContext.Provider>
  );
};
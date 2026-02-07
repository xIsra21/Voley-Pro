// src/servicios/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useCallback } from 'react';
import UseStorageState from '../storage/UseStorageState';
import { toast } from "react-toastify";
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [total, setTotal] = UseStorageState("total", 0);
  const [productos, setProductos] = UseStorageState("productos", []);

  // --- FUNCIÓN DE CARGA (REUTILIZABLE) ---
  const fetchCart = useCallback(async (userId) => {
    try {
      // Traemos el carrito pero haciendo un JOIN con la tabla productos 
      // para evitar datos bugueados o desactualizados
      const { data, error } = await supabase
        .from('carrito')
        .select(`
          cantidad,
          productos ( id, nombre, precio, imagen, categoria )
        `)
        .eq('user_id', userId);

      if (error) throw error;

      if (data) {
        const formateados = data.map(item => ({
          producto: item.productos, // Usamos la info fresca de la tabla productos
          cantidad: item.cantidad
        })).filter(p => p.producto !== null); // Limpiamos si el producto ya no existe

        setProductos(formateados);
        const nuevoTotal = formateados.reduce((acc, p) => acc + (p.producto.precio * p.cantidad), 0);
        setTotal(nuevoTotal);
      }
    } catch (err) {
      console.error("Error cargando carrito:", err.message);
    }
  }, [setProductos, setTotal]);

  // --- SINCRONIZACIÓN AL CAMBIAR DE USUARIO ---
  useEffect(() => {
    if (user) {
      fetchCart(user.id);
    } else {
      setProductos([]);
      setTotal(0);
    }
  }, [user, fetchCart]);

  const addProducto = async (producto) => {
    if (!producto?.id) return; // Evita añadir productos corruptos

    let nuevaCantidad = 1;
    const existe = productos.find(p => p.producto.id === producto.id);
    
    if (existe) {
      nuevaCantidad = existe.cantidad + 1;
    }

    // 1. Actualización Local (Inmediata para UX)
    const nuevosProductos = existe 
      ? productos.map(p => p.producto.id === producto.id ? { ...p, cantidad: nuevaCantidad } : p)
      : [...productos, { producto, cantidad: 1 }];

    setProductos(nuevosProductos);
    setTotal(prev => prev + producto.precio);
    toast.success(`${producto.nombre} añadido`);

    // 2. Sincronización DB (Si hay usuario)
    if (user) {
      const { error } = await supabase.from('carrito').upsert({
        user_id: user.id,
        producto_id: producto.id,
        cantidad: nuevaCantidad
        // NO guardamos datos_producto aquí, usamos el JOIN en el fetch
      }, { onConflict: 'user_id, producto_id' });

      if (error) console.error("Error sync DB:", error.message);
    }
  };

  const eliminarDelCarrito = async (id) => {
    const item = productos.find(p => p.producto.id === id);
    if (!item) return;

    // 1. Local
    setTotal(prev => prev - (item.producto.precio * item.cantidad));
    setProductos(productos.filter(p => p.producto.id !== id));
    toast.info("Producto eliminado");

    // 2. DB
    if (user) {
      await supabase
        .from('carrito')
        .delete()
        .eq('user_id', user.id)
        .eq('producto_id', id);
    }
  };

  return (
    <CartContext.Provider value={{ total, productos, addProducto, eliminarDelCarrito, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

// src/servicios/context/CartContext.jsx
import React, { createContext, useContext, useEffect } from 'react';
import UseStorageState from '../storage/UseStorageState';
import { toast } from "react-toastify";
import { supabase } from '../../lib/supabase'; // Asegúrate de que esta ruta sea correcta
import { useAuth } from './AuthContext';

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [total, setTotal] = UseStorageState("total", 0);
  const [productos, setProductos] = UseStorageState("productos", []);

  // --- CARGA Y LIMPIEZA AUTOMÁTICA ---
  useEffect(() => {
    const sincronizarCarrito = async () => {
      if (user) {
        // Al entrar: Traemos datos de Supabase
        const { data, error } = await supabase
          .from('carrito')
          .select('*')
          .eq('user_id', user.id);

        if (!error && data.length > 0) {
          const formateados = data.map(item => ({
            producto: item.datos_producto,
            cantidad: item.cantidad
          }));
          setProductos(formateados);
          setTotal(formateados.reduce((acc, p) => acc + (p.producto.precio * p.cantidad), 0));
        }
      } else {
        // Al salir: Limpiamos local
        setProductos([]);
        setTotal(0);
      }
    };
    sincronizarCarrito();
  }, [user]);

  const addProducto = async (producto) => {
    let existe = false;
    const productosAux = productos.map(p => {
      if (p.producto.id === producto.id) {
        existe = true;
        return { ...p, cantidad: p.cantidad + 1 };
      }
      return p;
    });

    if (!existe) productosAux.push({ producto, cantidad: 1 });

    setProductos(productosAux);
    setTotal(prev => prev + producto.precio);
    toast.success(`${producto.nombre} añadido`);

    // Sincronizar con DB si hay usuario
    if (user) {
      const item = productosAux.find(p => p.producto.id === producto.id);
      await supabase.from('carrito').upsert({
        user_id: user.id,
        producto_id: producto.id,
        cantidad: item.cantidad,
        datos_producto: producto
      });
    }
  };

  const eliminarDelCarrito = async (id) => {
    const item = productos.find(p => p.producto.id === id);
    if (item) {
      setTotal(prev => prev - (item.producto.precio * item.cantidad));
      setProductos(productos.filter(p => p.producto.id !== id));
      toast.info("Producto eliminado");

      if (user) {
        await supabase.from('carrito').delete().eq('user_id', user.id).eq('producto_id', id);
      }
    }
  };

  return (
    <CartContext.Provider value={{ total, setTotal, productos, setProductos, addProducto, eliminarDelCarrito }}>
      {children}
    </CartContext.Provider>
  );
};
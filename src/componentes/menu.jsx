import '../estilos/menu.css'
import { useAuth } from '../servicios/context/AuthContext';
import Links from './links'
import { Link } from "react-router-dom"
import { useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from '../servicios/context/CartContext';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CarritoPdf } from './carritoPdf';
import { toast } from "react-toastify";
import UserMenu from './UserMenu';
import { supabase } from '../lib/supabase'; // IMPORTANTE: Verifica esta ruta

// Componente Interno del Botón PDF
export const BotonPDFCheckout = memo(({ productos, total, onFinalizar }) => (
  <PDFDownloadLink
    document={<CarritoPdf productos={productos} total={total} />}
    fileName={`VoleyPro_Pedido_${new Date().getTime()}.pdf`}
  >
    {({ loading }) => (
      <button 
        className="checkout-btn" 
        disabled={loading}
        onClick={() => {
            if(!loading) onFinalizar();
        }}
      >
        {loading ? 'Generando PDF...' : 'Finalizar Compra'}
      </button>
    )}
  </PDFDownloadLink>
));

function Menu() {
  const { user } = useAuth();
  const { total, productos, setProductos, setTotal, eliminarDelCarrito } = useCart();
  const [carritoVisible, setCarritoVisible] = useState(false);
  
  const totalUnidades = productos.reduce((acc, p) => acc + p.cantidad, 0);

  // FUNCIÓN PARA VACIAR TODO (DB, LOCAL Y ESTADO)
  const handleFinalizarCompra = async () => {
    // Retraso para que el PDF capture los datos antes de borrar el estado
    setTimeout(async () => {
      try {
        // 1. Limpiar Supabase si el usuario está logueado
        if (user) {
          const { error } = await supabase
            .from('carrito')
            .delete()
            .eq('user_id', user.id);
          
          if (error) console.error("Error limpiando DB:", error.message);
        }

        // 2. Limpiar LocalStorage (invitados)
        localStorage.removeItem('carrito_invitado');

        // 3. Limpiar Estado de React (UI)
        setProductos([]);
        setTotal(0);
        setCarritoVisible(false);

        toast.success("¡Pedido finalizado y carrito vaciado!");
      } catch (error) {
        console.error("Error en el checkout:", error);
        toast.error("Error al procesar el cierre del carrito");
      }
    }, 800);
  };

  return (
    <div className='menu'>
      <div className="menu-left">
        <div className="pelota-container">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 100}}
            whileTap={{ scale: 0.9 }}
          >
            <img 
              src="/imagenes/pelota.png" 
              alt="pelota" 
              className="pelota"
              onClick={() => setCarritoVisible(!carritoVisible)} 
              style={{ cursor: 'pointer' }}
            />
          </motion.div>
          
          {totalUnidades > 0 && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="badge-count"
            >
              {totalUnidades}
            </motion.div>
          )}
        </div>
      </div>

      <div className="menu-center-group">
        <Links />
      </div>

      <div className="menu-right">
        {user ? (
          <UserMenu />
        ) : (
          <Link to="/login">Iniciar Sesión</Link>
        )}
      </div>

      <AnimatePresence>
        {carritoVisible && (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="carrito-dropdown"
          >
            <h3>Resumen de Carrito</h3>
            
            <div className="carrito-items">
              {productos.length === 0 ? (
                <p className="empty-msg">El carrito está vacío...</p>
              ) : (
                productos.map(p => (
                  <div key={p.producto.id} className="item-carrito">
                    <div className="item-info">
                      <span className="qty">{p.cantidad}x</span>
                      <span className="name">{p.producto.nombre}</span>
                    </div>
                    
                    <div className="item-price-actions">
                      <span className="price">
                        {(p.producto.precio * p.cantidad).toFixed(2)}€
                      </span>
                      <button 
                        className="del-btn" 
                        onClick={() => eliminarDelCarrito(p.producto.id)}
                      >
                        X
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {productos.length > 0 && (
              <div className="carrito-totals-bottom">
                <div className="total-row">
                  <span>Artículos totales:</span>
                  <strong>{totalUnidades}</strong>
                </div>
                <div className="total-row main-total">
                  <span>PRECIO TOTAL:</span>
                  <strong>{total.toFixed(2)} €</strong>
                </div>
                
                <BotonPDFCheckout
                  productos={productos}
                  total={total}
                  onFinalizar={handleFinalizarCompra}
                />
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Menu;
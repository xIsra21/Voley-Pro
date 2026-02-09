import '../estilos/menu.css'
import { useAuth } from '../servicios/context/AuthContext';
import Links from './links'
import { Link } from "react-router-dom"
import { useState, memo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from '../servicios/context/CartContext';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { CarritoPdf } from './carritoPdf';
import { toast } from "react-toastify";
import UserMenu from './UserMenu';
import { supabase } from '../lib/supabase';

// Componente del Botón con validación de función
export const BotonPDFCheckout = memo(({ productos, total, onFinalizar }) => (
  <PDFDownloadLink
    document={<CarritoPdf productos={productos} total={total} />}
    fileName={`VoleyPro_Pedido_${new Date().getTime()}.pdf`}
  >
    {({ loading }) => (
      <button 
        className="checkout-btn" 
        disabled={loading || !productos || productos.length === 0}
        onClick={() => {
            // Verificación crítica: solo ejecuta si onFinalizar es realmente una función
            if(!loading && typeof onFinalizar === 'function') {
                onFinalizar();
            }
        }}
      >
        {loading ? 'Preparando PDF...' : 'Finalizar Compra'}
      </button>
    )}
  </PDFDownloadLink>
));

function Menu() {
  const { user } = useAuth();
  const { total, productos, setProductos, setTotal, eliminarDelCarrito } = useCart();
  const [carritoVisible, setCarritoVisible] = useState(false);
  
  const totalUnidades = productos?.reduce((acc, p) => acc + p.cantidad, 0) || 0;

  // Usamos useCallback para mantener la referencia de la función estable
  const handleFinalizarCompra = useCallback(() => {
    // Retraso de seguridad para la generación del PDF
    setTimeout(async () => {
      try {
        // 1. Limpieza en Supabase
        if (user?.id) {
          await supabase
            .from('carrito')
            .delete()
            .eq('user_id', user.id);
        }

        // 2. Limpieza Local
        localStorage.removeItem('carrito_invitado');

        // 3. Actualización de estado con protección
        if (typeof setProductos === 'function') setProductos([]);
        if (typeof setTotal === 'function') setTotal(0);
        
        setCarritoVisible(false);
        toast.success("¡Compra finalizada y carrito vaciado!");
      } catch (error) {
        console.error("Error al finalizar compra:", error);
      }
    }, 1000); // 1 segundo de margen para el PDF
  }, [user, setProductos, setTotal]);

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
        {user ? <UserMenu /> : <Link to="/login">Iniciar Sesión</Link>}
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
              {!productos || productos.length === 0 ? (
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
                        onClick={() => eliminarDelCarrito(p.producto.id, p.producto)}
                      >
                        X
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {productos?.length > 0 && (
              <div className="carrito-totals-bottom">
                <div className="total-row">
                  <span>Artículos totales:</span>
                  <strong>{totalUnidades}</strong>
                </div>
                <div className="total-row main-total">
                  <span>PRECIO TOTAL:</span>
                  <strong>{(total || 0).toFixed(2)} €</strong>
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
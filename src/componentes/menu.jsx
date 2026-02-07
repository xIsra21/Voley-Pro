// Menu.jsx
import '../estilos/menu.css'
import { useAuth } from '../servicios/context/AuthContext';
import Links from './links'
import { Link } from "react-router-dom"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from '../servicios/context/CartContext';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { memo } from 'react';
import { CarritoPdf } from './carritoPdf';
import { toast } from "react-toastify"; // Importante para feedback
import UserMenu from './UserMenu';

export const BotonPDFCheckout = memo(({ productos, total, onFinalizar }) => (
  <PDFDownloadLink
    document={<CarritoPdf productos={productos} total={total} />}
    fileName="resumen_compra.pdf"
  >
    {({ loading }) => (
      <button 
        className="checkout-btn" 
        disabled={loading}
        onClick={() => {
            // Solo ejecutamos el vaciado si no está cargando el PDF
            if(!loading) onFinalizar();
        }}
      >
        Finalizar Compra
      </button>
    )}
  </PDFDownloadLink>
));

function Menu() {
  const { user, signOut } = useAuth();
  // Extraemos setProductos y setTotal del contexto del carrito
  const { total, productos, setProductos, setTotal, eliminarDelCarrito } = useCart();
  const [carritoVisible, setCarritoVisible] = useState(false);
  
  const totalUnidades = productos.reduce((acc, p) => acc + p.cantidad, 0);

  // FUNCIÓN PRAGMÁTICA PARA VACIAR EL CARRITO
  const handleFinalizarCompra = () => {
    // Retrasamos ligeramente el vaciado para permitir que el navegador inicie la descarga del PDF
    setTimeout(() => {
      setProductos([]); // Borra los productos
      setTotal(0);      // Resetea el total
      setCarritoVisible(false); // Cierra el menú desplegable
      toast.success("¡Compra finalizada! Descargando resumen...");
    }, 500);
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
            <>
              <UserMenu />
            </>
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
                    
                    {/* Agrupamos precio y botón para alinearlos con Flexbox */}
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
                
                {/* Pasamos la función de vaciado al botón */}
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
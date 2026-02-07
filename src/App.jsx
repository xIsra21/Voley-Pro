import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import './App.css'
import Menu from './componentes/menu'
import Cuerpo from './componentes/paginas/cuerpo'
import Footer from './componentes/footer'
import Autor from './componentes/paginas/autor'
import Pagina404 from './componentes/paginas/pagina404'
import Producto from './componentes/paginas/producto'
import Admin from './componentes/paginas/admin'
import Login from './componentes/paginas/login'
import { AuthProvider } from './servicios/context/AuthContext';
import ProtectedRoute from './componentes/layout/ProtectecRoute';
import { CartProvider } from './servicios/context/CartContext';
import Tienda from './componentes/paginas/tienda';
import Sistema from './componentes/paginas/sistema';
import Perfil from './componentes/paginas/perfil';


function App() {

  return (
    <AuthProvider>
      <CartProvider>
          <Routes>
            <Route path="/" element={
              <> 
                <Cuerpo />
              </>
            } />
            <Route path="/tienda" element={
              <> 
                <Menu/>
                <Tienda />
              </>
            } />
            <Route path="/sistema" element={
              <> 
                <Menu/>
                <Sistema />
                <Footer />
              </>
            } />
            <Route path="/login" element={
              <>
                <Menu/>
                <Login />
              </>
            } />
            <Route path="/perfil" element={
              <>
                <Menu/>
                <Perfil />
              </>
            } />
            <Route path="/autor" element={
              <ProtectedRoute>
                <Menu/>
                <Autor />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute>
                
                  <Menu/>
                  <Admin />

              </ProtectedRoute>
            } />
            <Route path="/producto/:id" element={
              <>
                <Menu/>
                <Producto />
              </>
            } />
            <Route path="*" element={
              <> 
                <Menu/>
                <Pagina404 />
              </>
            } />
          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={2000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            pauseOnHover
            theme='dark'
          />
      </CartProvider>
    </AuthProvider>
  )
}

export default App
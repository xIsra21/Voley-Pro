import { Navigate } from 'react-router-dom';
import { useAuth } from '../../servicios/context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  // FIX: Quitamos el div de "Cargando". 
  // Al devolver null, la pantalla se queda tal cual estaba hasta que decide 
  // si mostrar el contenido o redirigir, eliminando la vibración.
  if (loading) return null; 

  if (!user) {    
    return <Navigate to="/login" replace />;    
  }

  return children;
};

export default ProtectedRoute;
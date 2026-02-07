import { Link } from "react-router-dom"
import '../estilos/links.css'
import { useAuth } from '../servicios/context/AuthContext';
function Links(){
     const { user, signOut } = useAuth();
  const handleLogout = async () => {
    await signOut();
  };
    return(
        <>
            <nav className="nav">
            
                <Link className="nav-link" to="/">Inicio</Link>
                <Link className="nav-link" to="/tienda">Tienda</Link>
                <Link className="nav-link" to="/sistema">Sistema</Link>
                <Link className="nav-link" to="/autor">Autor</Link>
                <Link className="nav-link" to="/admin">Admin</Link>
            </nav>
        </>
    )
}

export default Links
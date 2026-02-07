import { Link } from "react-router-dom"
import '../estilos/links.css'
import { useAuth } from '../servicios/context/AuthContext';

function Links() {
  // Extraemos el usuario y el rol desde el AuthContext
  const { user, role } = useAuth(); 

  // Definimos los enlaces con una propiedad de seguridad
  const menuItems = [
    { nombre: "Inicio", ruta: "/", requiereAdmin: false },
    { nombre: "Tienda", ruta: "/tienda", requiereAdmin: false },
    { nombre: "Sistema", ruta: "/sistema", requiereAdmin: false },
    { nombre: "Autor", ruta: "/autor", requiereAdmin: false },
    { nombre: "Admin", ruta: "/admin", requiereAdmin: true },
  ];

  return (
    <nav className="nav">
      {menuItems.map((item) => {
        // Lógica de visualización condicional:
        // 1. Si no requiere admin, se muestra siempre.
        // 2. Si requiere admin, solo se muestra si el usuario existe y su rol es 'admin'.
        if (!item.requiereAdmin || (user && role === 'admin')) {
          return (
            <Link key={item.nombre} className="nav-link" to={item.ruta}>
              {item.nombre}
            </Link>
          );
        }
        return null;
      })}
    </nav>
  );
}

export default Links;
import { Link } from "react-router-dom";
import '../../estilos/pagina404.css';

function Pagina404() {
  return (
    <div className="p404-container">
      {/* Elementos decorativos de Voley rebotando al estilo del login */}
      <img src="/imagenes/pelota.png" className="volley-ball-float ball-1" alt="voley" />
      <img src="/imagenes/pelota.png" className="volley-ball-float ball-2" alt="voley" />

      <div className="p404-card">
        <h1 className="p404-code">404</h1>
        <h2 className="p404-title">FUERA DE PISTA</h2>
        <p className="p404-text">
          Has rematado fuera. La página que buscas no está en nuestro campo.
        </p>
        <Link to="/tienda" className="p404-button">
          Volver al Saque Inicial
        </Link>
      </div>
    </div>
  );
}

export default Pagina404;
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import servicioProductos from "../../servicios/servicioProductos";
import { useCart } from '../../servicios/context/CartContext';
import '../../estilos/producto.css';

function Producto() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addProducto } = useCart();
    const [producto, setProducto] = useState(null);

    useEffect(() => {
        servicioProductos.getProductById(id)
            .then((response) => {
                setProducto(response); 
            })
            .catch(() => {
                alert("Error al conectar con el servidor");
            });
    }, [id]);

    if (!producto) {
        return (
            <div className="producto-loading">
                <div className="spinner"></div>
                <p>CARGANDO EQUIPAMIENTO...</p>
            </div>
        );
    }

    return (
        <div className="producto-page-wrapper">
            <button className="back-btn" onClick={() => navigate(-1)}>
                ← VOLVER A LA TIENDA
            </button>

            <div className="producto-container-brutal">
                {/* Lado Izquierdo: Imagen */}
                <div className="producto-image-section">
                    <div className="producto-img-frame">
                        <img src={producto.url} alt={producto.nombre} />
                    </div>
                </div>

                {/* Lado Derecho: Información */}
                <div className="producto-info-section">
                    <span className="categoria-badge">{producto.categoria?.toUpperCase() || "ELITE"}</span>
                    <h1 className="producto-titulo-main">{producto.nombre.toUpperCase()}</h1>
                    
                    <div className="producto-rating">
                        ★★★★★ <span>(12 valoraciones de clientes)</span>
                    </div>

                    <div className="producto-precio-big">
                        {producto.precio} €
                    </div>

                    <div className="producto-detalles-tecnicos">
                        <p><strong>ORIGEN:</strong> {producto.origen || "Importación Oficial"}</p>
                        <p><strong>DISPONIBILIDAD:</strong> En Stock (Envío 24/48h)</p>
                        <p className="descripcion-mock">
                            Equipamiento de alto rendimiento diseñado para competición profesional. 
                            Materiales de máxima durabilidad probados en pista.
                        </p>
                    </div>

                    <button 
                        className="main-buy-btn" 
                        onClick={() => addProducto(producto)}
                    >
                        AÑADIR AL CARRITO
                    </button>

                    <div className="pago-seguro-info">
                        🛡️ Pago 100% seguro y devoluciones gratuitas
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Producto;
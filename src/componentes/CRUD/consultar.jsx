import '../../estilos/consultar.css';

function Consultar({ producto }) {
    if (!producto) return null;

    return (
        <div className="consultar-container">
            <h2 className="consultar-title">Ficha Técnica</h2>
            
            <div className="consultar-content">
                <div className="consultar-image-frame">
                    <img src={producto.url} alt={producto.nombre} />
                </div>

                <div className="consultar-details">
                    <div className="detail-item">
                        <span className="detail-label">NOMBRE</span>
                        <p className="detail-value">{producto.nombre.toUpperCase()}</p>
                    </div>

                    <div className="detail-row">
                        <div className="detail-item">
                            <span className="detail-label">ID</span>
                            <p className="detail-value">#{producto.id}</p>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">PRECIO</span>
                            <p className="detail-value highlight">{producto.precio} €</p>
                        </div>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">CATEGORÍA</span>
                        <p className="category-badge">{producto.categoria}</p>
                    </div>

                    <div className="detail-item">
                        <span className="detail-label">ORIGEN</span>
                        <p className="detail-value">{producto.origen || "N/A"}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Consultar;
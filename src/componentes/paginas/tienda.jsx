import '../../estilos/tienda.css';
import { Link } from "react-router-dom";
import { useEffect, useState, useMemo } from "react"; 
import servicioProductos from "../../servicios/servicioProductos";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from '../../servicios/context/CartContext';

function Tienda() {
    const { addProducto } = useCart();
    const [productos, setProductos] = useState([]);
    const [categoriaActiva, setCategoriaActiva] = useState("Todos");
    const [busqueda, setBusqueda] = useState("");

    useEffect(() => {
        let isMounted = true;
        servicioProductos.getAll()
            .then(response => {
                if (isMounted) setProductos(response.data);
            })
            .catch(() => alert("Error al cargar productos"));
        return () => { isMounted = false; };
    }, []);

    const categorias = useMemo(() => 
        ["Todos", ...new Set(productos.map(p => p.categoria).filter(Boolean))],
    [productos]);

    // LÓGICA DE FILTRADO OPTIMIZADA con useMemo
    const productosFiltrados = useMemo(() => {
        return productos.filter(p => {
            const nombre = p.nombre?.toLowerCase() || "";
            const categoria = p.categoria?.toLowerCase() || "";
            const termino = busqueda.toLowerCase();

            const coincideCategoria = categoriaActiva === "Todos" || p.categoria === categoriaActiva;
            const coincideBusqueda = nombre.includes(termino) || categoria.includes(termino);
            
            return coincideCategoria && coincideBusqueda;
        });
    }, [productos, categoriaActiva, busqueda]);

    return (
        <div className="tienda-wrapper">
            <div className="search-section">
                <div className="search-box-container">
                    <input 
                        type="text" 
                        placeholder="BUSCAR PRODUCTO O CATEGORÍA..." 
                        className="brutal-input"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                    />
                    {busqueda && (
                        <button className="clear-btn" onClick={() => setBusqueda("")}>X</button>
                    )}
                </div>
            </div>

            <nav className="submenu-categorias">
                {categorias.map(cat => (
                    <button 
                        key={cat}
                        className={`brutal-cat-btn ${categoriaActiva === cat ? 'active' : ''}`}
                        onClick={() => setCategoriaActiva(cat)}
                    >
                        {cat.toUpperCase()}
                    </button>
                ))}
            </nav>

            {/* Contenedor con min-height para evitar colapsos visuales */}
            <div className='cuerpo'>
                <AnimatePresence mode='popLayout'>
                    {productosFiltrados.map(item => (
                        <motion.div 
                            layout="position" // Solo anima la posición para evitar bugs de tamaño
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.1 } }}
                            key={item.id}
                            className="producto-card brutal-card"
                        >
                            <Link className="sinSubrayado" to={`/producto/${item.id}`}>
                                <div className="img-container">
                                    <img src={item.url} alt={item.nombre} loading="lazy" />
                                </div>
                                <div className="card-info">
                                    <h3>{item.nombre.toUpperCase()}</h3>
                                    <div className="estrellas">★★★★★ <small>(12)</small></div>
                                    <p className="precio-tag">{item.precio} €</p>
                                </div>
                            </Link>

                            <button className="add-to-cart-btn" onClick={() => addProducto(item)}>
                                AÑADIR AL CARRITO
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
            
            {productosFiltrados.length === 0 && (
                <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="no-results"
                >
                    <h2>SIN RESULTADOS EN PISTA</h2>
                    <button className="brutal-cat-btn" onClick={() => {setBusqueda(""); setCategoriaActiva("Todos");}}>
                        REINICIAR FILTROS
                    </button>
                </motion.div>
            )}
        </div>
    );
}

export default Tienda;
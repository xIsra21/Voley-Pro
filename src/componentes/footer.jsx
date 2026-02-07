import '../estilos/footer.css'
import { toast } from "react-toastify";

function Footer({ productos, setProductos, setTotal }) {

    const eliminar = (id) => {
        const item = productos.find(
            p => p.producto.id === id
        );

        if (!item) return;

        setProductos(
            productos.filter(p => p.producto.id !== id)
        );

        setTotal(prev =>
            prev - item.producto.precio * item.cantidad
        );

        toast.success("Producto eliminado del carrito");
    };

    return (
        <div className="footer">
            {/* {productos.length === 0 && (
                <p>Carrito vacío</p>
            )}

            {productos.map(item => (
                <span key={item.producto.id}>
                    {item.producto.nombre} x{item.cantidad}
                    <button
                        onClick={() =>
                            eliminar(item.producto.id)
                        }
                    >
                        X
                    </button>
                </span>
            ))} */}
        </div>
    );
}

export default Footer;

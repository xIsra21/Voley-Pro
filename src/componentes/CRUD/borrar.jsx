import Swal from "sweetalert2";
import { toast } from "react-toastify";
import servicioProductos from "../../servicios/servicioProductos";

function Borrar({ producto, productos, setProductos, onClose }) {

  const borrar = () => {
    Swal.fire({
        title: '¿ESTÁS SEGURO?',
        text: "¡No podrás revertir este cambio!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'SÍ, BORRAR',
        cancelButtonText: 'CANCELAR',
        // Aquí aplicamos las clases de arriba
        customClass: {
            popup: 'brutal-popup',
            title: 'brutal-title',
            htmlContainer: 'brutal-content',
            confirmButton: 'brutal-confirm-btn',
            cancelButton: 'brutal-cancel-btn'
        },
        buttonsStyling: false // IMPORTANTE: Desactiva los estilos por defecto de Swal
    }).then((result) => {

      if (!result.isConfirmed) return;

      servicioProductos.delete(producto.id)
        .then(() => {
          setProductos(
            productos.filter(p => p.id !== producto.id)
          );

          toast.success("Producto eliminado correctamente");

        })
        .catch(() => {
          toast.error("Error al eliminar el producto");
        });
    });
  };

  return (
    <button
      className="admin-btn admin-btn-borrar"
      onClick={borrar}
    >
      Borrar
    </button>
  );
}

export default Borrar;

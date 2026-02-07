import { toast } from "react-toastify";

class GestionProductos {

  // Ejemplo de uso en un componente o servicio


  add(producto, setTotal, productos, setProductos) {
    let existe = false;

    const productosAux = productos.map(p => {
      if (p.producto.id === producto.id) {
        existe = true;
        return { ...p, cantidad: p.cantidad + 1 };
      }
      return p;
    });

    if (!existe) {
      productosAux.push({ producto, cantidad: 1 });
    }

    setProductos(productosAux);

    setTotal(prev => prev + producto.precio);

    toast.success("Producto añadido al carrito");
  }


  remove(id, setProductos, setTotal) {
    setProductos(prev => {
      const prod = prev.find(p => p.producto.id === id);
      if (!prod) return prev;

      setTotal(t =>
        t - prod.producto.precio * prod.cantidad
      );

      return prev.filter(p => p.producto.id !== id);
    });

    toast.info("Producto eliminado del carrito");
  }

}

export default new GestionProductos();
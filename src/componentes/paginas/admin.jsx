import '../../estilos/admin.css';
import React, { useState, useEffect } from 'react';
import servicioProductos from "../../servicios/servicioProductos";
import Modal from '../modal';
import Consultar from '../CRUD/consultar';
import Crear from '../CRUD/crear';
import Editar from '../CRUD/editar';
import Borrar from '../CRUD/borrar';

// 1. Importamos los hooks necesarios para la seguridad
import { useAuth } from '../../servicios/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

function Admin() {
  // --- SEGURIDAD ---
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [autorizado, setAutorizado] = useState(false);
  const [verificandoRol, setVerificandoRol] = useState(true);

  // --- ESTADOS ORIGINALES ---
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const [productoSeleccionado, setProductoSeleccionado] = useState({
    "id": null,
    "nombre": null,
    "url": null,
    "origen": null,
    "precio": null
  });

  const [modals, setModals] = useState({
    crear: false,
    consultar: false,
    editar: false,
  });

  // --- LÓGICA DE PROTECCIÓN ---
  useEffect(() => {
    async function comprobarAcceso() {
      // Si el contexto termina de cargar y no hay usuario, redirigir
      if (!authLoading && !user) {
        navigate('/login');
        return;
      }

      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

          if (data?.role === 'admin') {
            setAutorizado(true);
          } else {
            navigate('/tienda'); 
          }
        } catch (err) {
          console.error("Error de permisos:", err);
          navigate('/');
        } finally {
          setVerificandoRol(false);
        }
      }
    }
    comprobarAcceso();
  }, [user, authLoading, navigate]);

  // --- EFECTO ORIGINAL ---
  useEffect(() => {
    // Solo cargamos productos si el usuario es admin verificado
    if (autorizado) {
      servicioProductos.getAll()
        .then((response) => setProductos(response.data))
        .catch(() => alert("Error al conectar con el servidor"));
    }
  }, [autorizado]);

  // --- FUNCIONES ORIGINALES ---
  const limpiarBusqueda = () => {
    setBusqueda("");
  };
  const gestionarModal = (tipoModal, estadoAbierto) => {
    setModals({ ...modals, [tipoModal]: estadoAbierto });
  };

  const productosFiltrados = productos
    .filter(p =>
      p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.categoria?.toLowerCase().includes(busqueda.toLowerCase())
    )
    .filter((item, index, self) => 
      index === self.findIndex((t) => t.id === item.id)
    );

  const consultarProducto = (producto) => {
    setProductoSeleccionado(producto);
    gestionarModal("consultar", true)
  };

  const editarProducto = (producto) => {
    setProductoSeleccionado(producto);
    gestionarModal("editar", true)
  };

  const crearProducto = () => gestionarModal("crear", true);

  // --- RENDERIZADO CONDICIONAL ---
  if (authLoading || verificandoRol) {
    return (
      <div className="admin-wrapper">
        <p style={{ textAlign: 'center', marginTop: '50px' }}>Verificando credenciales de administrador...</p>
      </div>
    );
  }

  // Si no está autorizado, no renderizamos nada (el useEffect ya habrá disparado el navigate)
  if (!autorizado) return null;

  return (
    <>
      <div className="admin-wrapper">
        <h2 className="admin-title">Gestión de Productos</h2>

        <div className="admin-search-container">
          <input
            type="text"
            placeholder="Buscar por nombre o categoría..."
            className="admin-search-input"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          {busqueda && (
            <button className="clear-search-btn" onClick={limpiarBusqueda}>
              X
            </button>
          )}
          <span className="results-count">{productosFiltrados.length} productos</span>
        </div>

        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.length > 0 ? (
                productosFiltrados.map((producto) => (
                  <tr key={producto.id}>
                    <td>
                        <img src={producto.url} alt={producto.nombre} className="admin-thumb" />
                    </td>
                    <td>
                        <strong>{producto.nombre}</strong>
                        <br/>
                        <small className="admin-cat-tag">{producto.categoria}</small>
                    </td>
                    <td>{producto.precio} €</td>
                    <td className="admin-actions-cell">
                      <button className="admin-btn-consulta" onClick={() => consultarProducto(producto)}>
                        Consulta
                      </button>
                      <button className="admin-btn-editar" onClick={() => editarProducto(producto)}>
                        Editar
                      </button>
                      <Borrar className="admin-btn-borrar"
                        producto={producto}
                        productos={productos}
                        setProductos={setProductos}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="admin-empty">No se encontraron productos.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <button className="admin-btn-crear" onClick={crearProducto}>
          + Crear Nuevo Producto
        </button>
      </div>

      <Modal isOpen={modals.crear} onClose={() => gestionarModal("crear", false)}>
        <Crear productos={productos} setProductos={setProductos} onClose={() => gestionarModal("crear", false)} />
      </Modal>

      <Modal isOpen={modals.consultar} onClose={() => gestionarModal("consultar", false)}>
        <Consultar producto={productoSeleccionado} onClose={() => gestionarModal("consultar", false)} />
      </Modal>

      <Modal isOpen={modals.editar} onClose={() => gestionarModal("editar", false)} >
        <Editar productos={productos} setProductos={setProductos} producto={productoSeleccionado} onClose={() => gestionarModal("editar", false)} />
      </Modal>
    </>
  );
}

export default Admin;
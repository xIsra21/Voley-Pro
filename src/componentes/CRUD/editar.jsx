import '../../estilos/crear.css'
import React, { useState } from 'react';
import servicioProductos from '../../servicios/servicioProductos';
import Swal from "sweetalert2";
import { toast } from "react-toastify";

function Editar({productos, setProductos, producto, onClose}){
    
     // Almacenar los errores del Formulario
    const [errores, setErrores] = useState({});
    
    // Amacenar los valores del formulario(En todo momento!!!) 
    const [form, setForm] = useState({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        origen: producto.origen,
        categoria: producto.categoria,
        url: producto.url
    });

    //////////////////////////////////////
    // Función para gestionar los cambios en los campos del formulario
    //////////////////////////////////////
    const gestionarCambio = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
        ...form,
        [name]:
        name === 'precio'
            ? parseInt(value, 10) || 0
            : type === 'checkbox'
            ? checked
            : value
    });
    };


    //////////////////////////////////////
    // Función de validación
    //////////////////////////////////////
    const validar = () => {
        const nuevosErrores = {};

        // Validación para "nombre"
        if (!form.nombre.trim()) {
        nuevosErrores.nombre = 'El nombre es obligatorio';
        }

        if (!form.origen.trim()) {
        nuevosErrores.origen = 'El origen es obligatorio';
        }

        if (!form.categoria.trim()) {
        nuevosErrores.nombre = 'La categoria es obligatoria';
        }

        if (!(form.url && 
        /^\/public\/.+\.(png|jpg|jpeg|gif|webp)$/i.test(form.url))) {
            nuevosErrores.url = 'Formato de la url no permitido';
        }


        if(form.precio < 0){
            nuevosErrores.precio = 'El precio no puede ser inferior a 0'
        }
        setErrores(nuevosErrores);

        // Retorna true si no hay errores, de lo contrario retorna false
        return Object.keys(nuevosErrores).length === 0;
    };

    // Función para manejar el envío del formulario
    const enviarFormulario = (e) => {
        e.preventDefault();

        if (!validar()) return;


        servicioProductos.update(producto.id, form)
        .then(() => {
            const productosActualizados = productos.map(p =>
                p.id === producto.id ? form : p
            );

            setProductos(productosActualizados);
            toast.success("Producto modificado correctamente");

            if (onClose) onClose();
        })
        .catch(() => {
            toast.error("Error al modificar el producto");
        });
    };



    return (
    <div className="crear">
        <form onSubmit={enviarFormulario}>
        <label htmlFor="nombre">Nombre</label>
        <input
            id="nombre"
            type="text"
            name="nombre"
            value={form.nombre}
            onChange={gestionarCambio}
            placeholder="Escribe nombre del producto"
        />
        {errores.nombre && <p className="error">{errores.nombre}</p>}

        <label htmlFor="origen">Origen</label>
        <input
            id="origen"
            type="text"
            name="origen"
            value={form.origen}
            onChange={gestionarCambio}
            placeholder="Escribe origen del producto"
        />
        {errores.origen && <p className="error">{errores.origen}</p>}

        <label htmlFor="url">URL</label>
        <input
            id="url"
            type="text"
            name="url"
            value={form.url}
            onChange={gestionarCambio}
            placeholder="Escribe url de la imagen"
        />
        {errores.url && <p className="error">{errores.url}</p>}

        <label htmlFor="categoria">Categoria</label>
        <input
            id="categoria"
            type="text"
            name="categoria"
            value={form.categoria}
            onChange={gestionarCambio}
            placeholder="Escribe categoria del producto"
        />
        {errores.categoria && <p className="categoria">{errores.categoria}</p>}

        <label htmlFor="precio">Precio</label>
        <input
            id="precio"
            step="0.01"
            type="number"
            name="precio"
            value={form.precio}
            onChange={gestionarCambio}
            placeholder="Escribe precio del producto"
        />
        {errores.precio && <p className="error">{errores.precio}</p>}

        <button type="submit" className="admin-btn">Modificar</button>
        </form>
    </div>
);

}

export default Editar
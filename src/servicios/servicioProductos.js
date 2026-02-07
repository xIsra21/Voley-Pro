// src/servicios/servicioProductos.js
import { supabase } from "../lib/supabase"; 

class servicioProductos {
  // Obtenemos todos los productos
  async getAll() {
    const { data, error } = await supabase.from('productos').select('*');
    if (error) throw error;
    return { data }; // Devolvemos { data: [...] } para que coincida con lo que hacía Axios
  }

  // Buscar por ID (reutilizando la lógica de búsqueda en array que ya tenías)
  async getProductById(id) {
    const { data, error } = await supabase.from('productos').select('*');
    if (error) throw error;
    return data.find(p => p.id.toString().toLowerCase() === id.toString().toLowerCase());
  }

  // Obtener uno solo por ID de base de datos
  async get(id) {
    const { data, error } = await supabase.from('productos').select('*').eq('id', id).single();
    if (error) throw error;
    return { data };
  }

  async create(data) {
    return await supabase.from('productos').insert([data]);
  }

  async update(id, data) {
    // Eliminamos el ID de la data para no intentar actualizar la clave primaria
    const { id: _, ...updateData } = data;
    return await supabase.from('productos').update(updateData).eq('id', id);
  }

  async delete(id) {
    return await supabase.from('productos').delete().eq('id', id);
  }
}

export default new servicioProductos();
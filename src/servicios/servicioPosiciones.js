// src/servicios/servicioPosiciones.js
import { supabase } from "../lib/supabase";

const getAll = async () => {
    const { data, error } = await supabase.from('posiciones').select('*');
    if (error) throw error;
    return { data }; // Mantenemos el formato { data: [...] }
};

export default { getAll };
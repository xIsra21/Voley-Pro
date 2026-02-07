// src/servicios/servicioPosiciones.js
import axios from "axios";

// Asegúrate de que esta URL coincida con tu json-server
// Si usas el puerto 3000 o 3001, cámbialo aquí.
const BASE_URL = "http://localhost:3000/posiciones";

const getAll = () => {
    return axios.get(BASE_URL);
};

export default { getAll };
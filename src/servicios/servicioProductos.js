
import http from "./http-axios.js";

class servicioProductos {
  getAll() {
    return http.get("/productos");
  }

  getProductById(id) {
    return http.get("/productos").then(response => {
      return response.data.find(p => 
        p.id.toString().toLowerCase() === id.toString().toLowerCase());
    });
  }

  get(id) {
    return http.get(`/productos/${id}`);
  }

  create(data) {
    return http.post("/productos", data);
  }

  update(id, data) {
    console.log(id,data)
    return http.put(`/productos/${id}`, data);
  }

  delete(id) {
    return http.delete(`/productos/${id}`);
  }

}

export default new servicioProductos();

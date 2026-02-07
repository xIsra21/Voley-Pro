class LocalStorageServicio {
    static get(valor) {
      try {
        const item = window.localStorage.getItem(valor);
        return item ? JSON.parse(item) : null;
      } catch (error) {
        console.error("Error LEYENDO el valor", valor, error);
        return null;
      }
    }
  
    static set(clave, valor) {
      try {
        window.localStorage.setItem(clave, JSON.stringify(valor));
      } catch (error) {
        console.error("Error GUARDANDO el valor", clave, error);
      }
    }
  
    static remove(valor) {
      try {
        window.localStorage.removeItem(valor);
      } catch (error) {
        console.error("Error BORRANDO el valor", valor, error);
      }
    }
  
    static clear() {
      try {
        window.localStorage.clear();
      } catch (error) {
        console.error("Error LIMPIANDO localStorage", error);
      }
    }
  }
  
  export default LocalStorageServicio;
  
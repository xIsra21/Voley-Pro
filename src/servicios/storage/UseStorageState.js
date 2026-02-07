import { useState, useEffect } from "react";
import LocalStorageServicio from "./storage.js"

function UseStorageState(clave, valorInicial) {
  const [state, setState] = useState(() => {
    console.log("Dentro...")
    
    // Recupera el valor inicial desde localStorage o usa el valor predeterminado
    const valorGuardado = LocalStorageServicio.get(clave);
    return valorGuardado !== null ? valorGuardado : valorInicial;
  });

  useEffect(() => {

    // Guarda el estado en localStorage cada vez que cambie
    LocalStorageServicio.set(clave, state);
    
  }, [clave, state]);

  return [state, setState];
}

export default UseStorageState;

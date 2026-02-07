import { Link } from "react-router-dom"
import '../estilos/links.css'
import { useAuth } from '../servicios/context/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

function Links() {
    const { user } = useAuth();
    const [esAdmin, setEsAdmin] = useState(false);

    // Verificamos el rol de la misma forma que en el componente Admin
    useEffect(() => {
        async function verificarRol() {
            if (user) {
                try {
                    const { data, error } = await supabase
                        .from('profiles')
                        .select('role')
                        .eq('id', user.id)
                        .single();

                    if (!error && data?.role === 'admin') {
                        setEsAdmin(true);
                    } else {
                        setEsAdmin(false);
                    }
                } catch (err) {
                    setEsAdmin(false);
                }
            } else {
                setEsAdmin(false);
            }
        }
        verificarRol();
    }, [user]);

    return (
        <nav className="nav">
            <Link className="nav-link" to="/">Inicio</Link>
            <Link className="nav-link" to="/tienda">Tienda</Link>
            <Link className="nav-link" to="/sistema">Sistema</Link>
            <Link className="nav-link" to="/autor">Autor</Link>
            
            {/* Solo mostramos Admin si la verificación manual da true */}
            {esAdmin && (
                <Link className="nav-link" to="/admin">Admin</Link>
            )}
        </nav>
    )
}

export default Links;
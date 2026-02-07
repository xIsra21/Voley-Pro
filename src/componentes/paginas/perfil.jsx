import { useState } from "react";
import { useAuth } from '../../servicios/context/AuthContext';
import { toast } from "react-toastify";
import '../../estilos/perfil.css';

function Perfil() {
    const { user, updatePassword } = useAuth();
    const [pass, setPass] = useState("");
    const [actionLoading, setActionLoading] = useState(false);

    // Si el usuario no existe todavía, mostramos un contenedor vacío estable
    // para que la página no "vibre" mientras carga
    if (!user) return <div className="perfil-container"></div>;

    const handlePass = async (e) => {
        e.preventDefault();
        
        if (pass.length < 8) {
            return toast.error("La contraseña debe tener al menos 8 caracteres");
        }
        
        setActionLoading(true);
        const { error } = await updatePassword(pass);
        setActionLoading(false);
        
        if (error) {
            toast.error(error.message);
        } else { 
            toast.success("Contraseña actualizada correctamente"); 
            setPass(""); 
        }
    };

    return (
        <div className="perfil-container">
            <div className="card">
                <div className="perfil-header">
                    {/* Solo mostramos el email del usuario */}
                    <h2>{user?.email}</h2>
                </div>
                
                <form onSubmit={handlePass} className="perfil-form-section">
                    <h3>Seguridad de la cuenta</h3>
                    <input 
                        type="password" 
                        value={pass} 
                        onChange={e => setPass(e.target.value)} 
                        placeholder="NUEVA CONTRASEÑA" 
                    />
                    <button 
                        type="submit" 
                        disabled={actionLoading} 
                        className="btn-submit-profile"
                    >
                        {actionLoading ? 'PROCESANDO...' : 'ACTUALIZAR CONTRASEÑA'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Perfil;
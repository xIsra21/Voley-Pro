import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../servicios/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import '../estilos/Usermenu.css';

function UserMenu() {
    const { user, signOut } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const menuRef = useRef();

    useEffect(() => {
        const closeMenu = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setIsOpen(false); };
        document.addEventListener("mousedown", closeMenu);
        return () => document.removeEventListener("mousedown", closeMenu);
    }, []);

    const handleAction = async (action) => {
        setIsOpen(false);
        
        if (action === 'logout') {
            await signOut(); // Primero limpiamos sesión
            toast.info("Sesión cerrada");
            navigate('/', { replace: true }); // Redirigimos a home y limpiamos historial
        } else if (action === 'perfil') {
            navigate('/perfil');
        } else if (action === 'change') {
            await signOut();
            navigate('/login', { replace: true });
        }
    };

    // Este condicional es el que hace que el componente desaparezca tras el signOut
    if (!user) return null;
    
    const initial = user.email?.charAt(0).toUpperCase();

    return (
        <div className="user-menu-container" ref={menuRef}>
            <div className="avatar-trigger" onClick={() => setIsOpen(!isOpen)}>
                {user.user_metadata?.avatar_url ? (
                    <img src={user.user_metadata.avatar_url} alt="Profile" />
                ) : (
                    <div className="avatar-initials">{initial}</div>
                )}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        className="user-dropdown"
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    >
                        <div className="dropdown-info">
                            <p>{user.email}</p>
                        </div>
                        <ul className="dropdown-nav">
                            <li onClick={() => handleAction('perfil')}>👤 Mi Perfil</li>
                            <li onClick={() => handleAction('change')}>🔄 Cambiar cuenta</li>
                            <li onClick={() => handleAction('logout')} className="logout-btn">🚪 Cerrar Sesión</li>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default UserMenu;
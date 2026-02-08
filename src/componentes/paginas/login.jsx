import { useState } from "react";
import { useAuth } from '../../servicios/context/AuthContext';
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useNavigate, Link } from 'react-router-dom';
import "../../estilos/login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    // --- COMPROBACIONES PRAGMÁTICAS ---
    
    // 1. Validación de formato de Email (Regex estándar)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("El formato del correo electrónico no es válido.");
      return;
    }

    // 2. Validación de Contraseña (Solo se aplica estrictamente en el Registro)
    // En el Login solo pedimos que no esté vacía para no bloquear accesos por cambios de reglas.
    if (isSignUp) {
      if (password.length < 8) {
        setError("La contraseña debe tener al menos 8 caracteres.");
        return;
      }
      if (!/[A-Z]/.test(password)) {
        setError("La contraseña debe incluir al menos una letra mayúscula.");
        return;
      }
      if (!/[0-9]/.test(password)) {
        setError("La contraseña debe incluir al menos un número.");
        return;
      }
    }
    // --- FIN DE COMPROBACIONES ---

    setLoading(true);

    try {
      let result;
      if (isSignUp) {
        result = await signUp(email, password);
        if (!result.error) {
          Swal.fire({
            title: 'Verifica tu email',
            text: "Te ha llegado un correo de confirmación",
            icon: 'success',
            confirmButtonText: 'ACEPTAR',
            customClass: {
              popup: 'brutal-popup',
              title: 'brutal-title',
              htmlContainer: 'brutal-content',
              confirmButton: 'brutal-confirm-btn',
            },
            buttonsStyling: false 
          });
          setIsSignUp(false);
        }
      } else {
        result = await signIn(email, password);
        if (!result.error) {
          navigate('/tienda');
        }
      }
      
      if (result?.error) {
        // Mapeo de errores comunes de Firebase/Auth para el usuario
        const msg = result.error.code === 'auth/invalid-credential' 
          ? "Credenciales incorrectas" 
          : result.error.message;
        setError(msg);
      }
    } catch (err) {
      setError('Error inesperado de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-card-container fade-in">
        <div className="login-card-header">
          <h1>{isSignUp ? 'CREAR CUENTA' : 'BIENVENIDO'}</h1>
          <p>{isSignUp ? 'Únete a nuestra comunidad' : 'Ingresa tus credenciales'}</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form-body">
          <div className="input-group">
            <label>EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nombre@ejemplo.com"
              required
            />
          </div>

          <div className="input-group">
            <label>CONTRASEÑA</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && <div className="error-banner">{error}</div>}

          <button type="submit" disabled={loading} className="main-login-btn">
            {loading ? 'PROCESANDO...' : (isSignUp ? 'REGISTRARME' : 'ENTRAR')}
          </button>

          <div className="divider"><span>O CONTINÚA CON</span></div>

          <button 
            type="button" 
            onClick={() => signInWithGoogle()} 
            className="google-btn"
          >
            <img src="/imagenes/google.png" alt="Google" />
          </button>
        </form>

        <div className="login-footer">
          <button className="text-toggle-btn" onClick={() => {
            setIsSignUp(!isSignUp);
            setError(""); // Limpiamos errores al cambiar de modo
          }}>
            {isSignUp ? '¿Ya tienes cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate'}
          </button>
          
          <div className="guest-section">
            <Link to="/tienda" className="guest-link">
              CONTINUAR SIN INICIAR SESIÓN →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
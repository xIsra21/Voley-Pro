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
    setLoading(true);

    try {
      let result;
      if (isSignUp) {
        result = await signUp(email, password);
        if (!result.error) {
          Swal.fire({
            icon: 'success',
            title: 'Verifica tu email',
            text: 'Te hemos enviado un enlace de confirmación.',
            confirmButtonColor: '#000'
          });
          setIsSignUp(false);
        }
      } else {
        result = await signIn(email, password);
        if (!result.error) {
          navigate('/tienda');
        }
      }
      if (result?.error) setError(result.error.message);
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
            <img src="/imagenes/google.png" />
        
          </button>
        </form>

        <div className="login-footer">
          <button className="text-toggle-btn" onClick={() => setIsSignUp(!isSignUp)}>
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
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import '../../estilos/cuerpo.css';

function Cuerpo() {
    const navigate = useNavigate();
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationFrame;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.speedX = (Math.random() - 0.5) * 1.2;
                this.speedY = (Math.random() - 0.5) * 1.2;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
                if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
            }
        }

        const init = () => {
            particles = [];
            for (let i = 0; i < 80; i++) particles.push(new Particle());
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => p.update());

            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let dx = particles[a].x - particles[b].x;
                    let dy = particles[a].y - particles[b].y;
                    let dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 150) {
                        // Cambiado a Rojo Voley con opacidad
                        ctx.strokeStyle = `rgba(231, 76, 60, ${0.4 - dist / 150})`;
                        ctx.lineWidth = 2; // Líneas más gruesas para estilo brutalista
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
            animationFrame = requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resize);
        resize(); init(); draw();
        return () => {
            window.removeEventListener('resize', resize);
            cancelAnimationFrame(animationFrame);
        };
    }, []);

    return (
        <div className="main-landing">
            <canvas ref={canvasRef} className="landing-canvas"></canvas>
            
            <motion.div 
                className="landing-content"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                <h1 className="landing-title">
                    VOLEY <span className="red-box">PRO</span>
                </h1>
                
                <p className="landing-subtitle">EQUIPAMIENTO DE ÉLITE PARA PROFESIONALES</p>
                
                <div className="landing-buttons-grid">
                    <motion.button 
                        whileHover={{ translate: "-4px -4px", boxShadow: "8px 8px 0px #000" }}
                        whileTap={{ translate: "0px 0px", boxShadow: "2px 2px 0px #000" }}
                        className="landing-btn yellow"
                        onClick={() => navigate('/tienda')}
                    >
                        EXPLORAR TIENDA
                    </motion.button>

                    <motion.button 
                        whileHover={{ translate: "-4px -4px", boxShadow: "8px 8px 0px #000" }}
                        whileTap={{ translate: "0px 0px", boxShadow: "2px 2px 0px #000" }}
                        className="landing-btn white"
                        onClick={() => navigate('/sistema')}
                    >
                        SISTEMA DE JUEGO
                    </motion.button>

                    <motion.button 
                        whileHover={{ translate: "-4px -4px", boxShadow: "8px 8px 0px #e74c3c" }}
                        whileTap={{ translate: "0px 0px", boxShadow: "2px 2px 0px #e74c3c" }}
                        className="landing-btn black"
                        onClick={() => navigate('/login')}
                    >
                        INICIAR SESIÓN
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}

export default Cuerpo;
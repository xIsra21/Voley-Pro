import React from 'react';
import { motion } from 'framer-motion';
import '../../estilos/autor.css';

const Autor = () => {
    const fechaSesion = new Date().toLocaleString();

    return (
    <motion.div 
        className="autor-page"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
    >
      {/* Sección Hero / Perfil */}
    <section className="autor-hero">
        <motion.div 
            className="autor-card-principal"
            initial={{ y: 50 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100 }}
        >
            <div className="autor-avatar">
                <img src="/pelota.png" alt="Avatar" /> {/* Puedes poner tu foto aquí */}
            </div>
            <h1>Israel Royano Oro</h1>
            <p className="autor-tagline">Desarrollador Full Stack | Amante del Voleibol</p>

        <div className="autor-details">
            <p><strong>Soy Israel Royano Oro, estudiante en prácticas de DAW, enfocado en el desarrollo de aplicaciones web con un estilo visual Neo-brutalista. 
                En mi proyecto Voley-Pro, he integrado un stack profesional basado en React 18 y Supabase, implementando una lógica de persistencia híbrida (LocalStorage y PostgreSQL) 
                que garantiza un carrito de compras funcional y seguro, tanto para invitados como para usuarios autenticados.</strong></p>
        </div>
        </motion.div>
    </section>

      {/* Sección Información del Proyecto */}
    <section className="proyecto-info">
        <motion.div 
            className="info-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
            visible: { transition: { staggerChildren: 0.2 } }
        }}
        >
            <motion.div className="info-card" variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}>
            <h3>🏐 El Proyecto</h3>
            <p><strong>React Volley</strong> es una plataforma de gestión deportiva diseñada para optimizar el inventario y la venta de equipamiento profesional.</p>
            </motion.div>

            <motion.div className="info-card" variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}>
            <h3>🚀 Objetivo</h3>
            <p>Crear una experiencia de usuario fluida, reactiva y visualmente impactante utilizando las últimas tecnologías de desarrollo web.</p>
            </motion.div>

            <motion.div className="info-card" variants={{ hidden: { opacity: 0, scale: 0.8 }, visible: { opacity: 1, scale: 1 } }}>
            <h3>🛠️ Tech Stack</h3>
            <div className="tech-tags">
                <span>React 18</span>
                <span>Vite</span>
                <span>Framer Motion</span>
                <span>React Router Dom</span>
                <span>React Toastify</span>
                <span>Supabase</span>
                <span>Vercel</span>
                <span>Context API</span>
                <span>CSS3 Modern</span>
                <span>Google Cloud</span>
            </div>
            </motion.div>
        </motion.div>
        </section>
    </motion.div>
  );
};

export default Autor;
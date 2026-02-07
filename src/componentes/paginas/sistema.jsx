import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import servicioPosiciones from '../../servicios/servicioPosiciones';
import '../../estilos/sistema.css';

function Sistema() {
    const [datos, setDatos] = useState([]);
    const [sistema, setSistema] = useState('5-1');
    const [rotacion, setRotacion] = useState('R1');

    useEffect(() => {
        servicioPosiciones.getAll().then(res => setDatos(res.data));
    }, []);

    const jugadores = useMemo(() => {
        return datos.filter(p => p.sistema === sistema && p.rotacion === rotacion);
    }, [datos, sistema, rotacion]);

    return (
        <div className="sistema-container">
            <div className="panel-izquierdo">
                <h3 className="brutal-tag">SISTEMA</h3>
                {['5-1', '4-2'].map(s => (
                    <button key={s} className={sistema === s ? 'btn-active' : ''} onClick={() => setSistema(s)}>{s}</button>
                ))}
            </div>

            <div className="cancha-espacio">
                <div className="pista-voley">
                    {/* Líneas de campo */}
                    <div className="red-zona"></div>
                    <div className="linea-3m"></div>
                    
                    <AnimatePresence>
                        {jugadores.map(j => (
                            <motion.div 
                                key={j.id}
                                className="ficha-jugador"
                                initial={{ scale: 0 }}
                                animate={{ top: j.top, left: j.left, scale: 1 }}
                                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                            >
                                <div className="ficha-header">{j.titulo}</div>
                                <div className="ficha-body">{j.rol}</div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            <div className="panel-derecho">
                <h3 className="brutal-tag">ROTACIÓN</h3>
                {['R1', 'R2', 'R3', 'R4', 'R5', 'R6'].map(r => (
                    <button key={r} className={rotacion === r ? 'btn-active' : ''} onClick={() => setRotacion(r)}>{r}</button>
                ))}
            </div>
        </div>
    );
}

export default Sistema;
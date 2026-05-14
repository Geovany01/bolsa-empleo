import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth, api } from '../services/AuthContext';

export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const [error, setError] = useState('');

  useEffect(() => {
    const procesarCallback = async () => {
      try {
        const token = searchParams.get('token');

        if (!token) {
          setError('Token no recibido. Intenta nuevamente.');
          setTimeout(() => navigate('/login'), 3000);
          return;
        }

        // Guardar token en localStorage
        localStorage.setItem('token', token);

        // Obtener datos del usuario autenticado
        const usuario = await api('/auth/me');

        // Actualizar contexto de autenticación
        login(token, usuario);

        // Redirigir según el rol
        const destinos = {
          estudiante: '/',
          empresa: '/empresa',
          admin: '/admin'
        };

        const destino = destinos[usuario.rol] || '/';
        navigate(destino, { replace: true });
      } catch (err) {
        console.error('Error en callback:', err);
        setError('Error durante la autenticación. Intenta nuevamente.');
        setTimeout(() => navigate('/login'), 3000);
      }
    };

    procesarCallback();
  }, [searchParams, navigate, login]);

  return (
    <div className="container page" style={{ textAlign: 'center', paddingTop: 60 }}>
      {error ? (
        <>
          <h2 style={{ color: '#d32f2f' }}>Error de autenticación</h2>
          <p>{error}</p>
          <p style={{ fontSize: 12, color: '#999' }}>Redirigiendo...</p>
        </>
      ) : (
        <>
          <h2>Completando autenticación...</h2>
          <div className="loading" style={{ marginTop: 20 }}>Cargando</div>
        </>
      )}
    </div>
  );
}

// Configuración de URL base según entorno
const isLocalhost = location.hostname === 'localhost';

const API_URL = isLocalhost
  ? 'http://localhost:4000' 
  : 'https://api.midominio.com'; 

/**
 * apiFetch centraliza llamadas al backend
 * @param {string} endpoint - Ruta relativa del backend (ej: "/users/login")
 * @param {object} options - Opciones del fetch (method, body, etc)
 * @returns {Promise<any>} - JSON o error
 */
export const apiFetch = async (endpoint, options = {}) => {
  const res = await fetch(API_URL + '/api' + endpoint, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(sessionStorage.getItem('token') && {
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      }),
    },
    body: options.body ? JSON.stringify(options.body) : null,
  });

  const data = await res.json().catch(() => ({})); // evita error si no es JSON

  if (!res.ok) {
    const error = new Error(data.message || 'Error en la petición');
    error.status = res.status;
    throw error;
  }

  return data;
};

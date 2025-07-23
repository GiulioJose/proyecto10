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
  const isFormData = options.isFormData === true;

  const headers = {
    ...(sessionStorage.getItem('token') && {
      Authorization: 'Bearer ' + sessionStorage.getItem('token'),
    }),
  };

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(API_URL + '/api' + endpoint, {
    method: options.method || 'GET',
    headers,
    body: isFormData ? options.body : JSON.stringify(options.body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.message || 'Error en la petición');
    error.status = res.status;
    throw error;
  }

  return data;
};


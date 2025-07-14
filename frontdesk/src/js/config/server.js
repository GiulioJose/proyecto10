const isLocalhost = location.hostname === 'localhost';

export const API_URL = isLocalhost
  ? 'http://localhost:4000'     // backend local
  : 'https://api.midominio.com'; // backend en producción

import { apiFetch } from '../utils/apiFetch.js';
import { showLoading, hideLoading } from '../components/loading.js';
import { refreshHeader } from '../components/header.js';

// Función para decodificar un JWT sin usar librerías
function decodeToken(token) {
  const payload = token.split('.')[1];
  const decoded = atob(payload);
  return JSON.parse(decoded);
}

export const handleLogin = async (email, password, messageEl) => {
  if (!email || !password) {
    messageEl.textContent = 'Por favor, completa todos los campos';
    return;
  }

  try {
    showLoading();

    const res = await apiFetch('/users/login', {
      method: 'POST',
      body: { email, password }
    });

    // Guardar el token
    sessionStorage.setItem('token', res.token);

    // ✅ Decodificar el token y guardar userId y rol
    const decoded = decodeToken(res.token);
    sessionStorage.setItem('userId', decoded.id);
    sessionStorage.setItem('role', decoded.rol || 'user');

    hideLoading();
    refreshHeader();
    location.hash = '#home';

  } catch (err) {
    hideLoading();
    console.error('Error al iniciar sesión:', err);
    messageEl.textContent = err.message || 'Error al iniciar sesión';
  }
};

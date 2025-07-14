import { apiFetch } from '../utils/apiFetch.js';
import { showLoading, hideLoading } from '../components/loading.js';
import { refreshHeader } from '../components/header.js';

// Función para decodificar un JWT sin librerías externas
function decodeToken(token) {
  const payload = token.split('.')[1];
  const decoded = atob(payload);
  return JSON.parse(decoded);
}

export const handleRegister = async (nombre, email, password, messageEl) => {
  if (!nombre || !email || !password) {
    messageEl.textContent = 'Por favor, completa todos los campos';
    return;
  }

  try {
    showLoading();

    const res = await apiFetch('/users/register', {
      method: 'POST',
      body: { nombre, email, password }
    });

    // Guardar token
    sessionStorage.setItem('token', res.token);

    // ✅ Decodificar token para obtener el userId y rol
    const decoded = decodeToken(res.token);
    sessionStorage.setItem('userId', decoded.id);
    sessionStorage.setItem('role', decoded.rol || 'user');

    hideLoading();
    refreshHeader();
    location.hash = '#home';

  } catch (err) {
    hideLoading();
    console.error('Error al registrar usuario:', err);
    messageEl.textContent = err.message || 'Error al registrarse';
  }
};

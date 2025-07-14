import { apiFetch } from '../utils/apiFetch';
import { showLoading, hideLoading } from '../components/loading';
import { refreshHeader } from '../components/header';

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

    sessionStorage.setItem('token', res.token);

    hideLoading();
    refreshHeader();                // 🔄 actualiza header sin recargar
    location.hash = '#home';

  } catch (err) {
    hideLoading();
    console.error('Error al registrar usuario:', err);
    messageEl.textContent = err.message || 'Error al registrarse';
  }
};

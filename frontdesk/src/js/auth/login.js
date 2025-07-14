import { apiFetch } from '../utils/apiFetch';
import { showLoading, hideLoading } from '../components/loading';
import { refreshHeader } from '../components/header';

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

    sessionStorage.setItem('token', res.token);
    sessionStorage.setItem('role', res.user.rol || 'user'); // ← CORREGIDO

    hideLoading();
    refreshHeader();
    location.hash = '#home';

  } catch (err) {
    hideLoading();
    console.error('Error al iniciar sesión:', err);
    messageEl.textContent = err.message || 'Error al iniciar sesión';
  }
};

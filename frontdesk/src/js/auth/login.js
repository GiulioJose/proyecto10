import { apiFetch } from '../utils/apiFetch';
import { showLoading, hideLoading } from '../components/loading';
import { renderHome } from '../views/home';

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
    hideLoading();

    document.body.innerHTML = ''; // limpia vista anterior
    document.body.appendChild(renderHome());

  } catch (err) {
    hideLoading();
    console.error('Error al iniciar sesión:', err);
    messageEl.textContent = err.message || 'Error al iniciar sesión';
  }
};

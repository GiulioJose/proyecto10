import { createEl } from '../utils/createElements.js';
import { apiFetch } from '../utils/apiFetch.js';
import { showLoading, hideLoading } from '../components/loading.js';

export default async function viewLogin() {
  const container = createEl('div', 'login-container');
  const title = createEl('h2', null, 'Iniciar Sesión');
  const form = createEl('form', 'login-form');

  const emailInput = createEl('input');
  emailInput.type = 'email';
  emailInput.placeholder = 'Email';
  emailInput.name = 'email';

  const passwordInput = createEl('input');
  passwordInput.type = 'password';
  passwordInput.placeholder = 'Contraseña';
  passwordInput.name = 'password';

  const submitBtn = createEl('button', 'submit-btn', 'Entrar');
  submitBtn.type = 'submit';

  const message = createEl('p', 'message');

  form.append(emailInput, passwordInput, submitBtn, message);
  container.append(title, form);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!email || !password) {
      message.textContent = 'Por favor, completa todos los campos';
      return;
    }

    try {
      showLoading();
      const res = await apiFetch('/users/login', {
        method: 'POST',
        body: { email, password }
      });
      hideLoading();

      sessionStorage.setItem('token', res.token);
      sessionStorage.setItem('role', res.role || 'user');
      location.hash = '#home';

    } catch (err) {
      hideLoading();
      console.error('Error al iniciar sesión:', err);
      message.textContent = err.message || 'Error al iniciar sesión';
    }
  });

  return container;
}

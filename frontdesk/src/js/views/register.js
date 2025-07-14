import { createEl } from '../utils/createElements.js';
import { apiFetch } from '../utils/apiFetch.js';
import { showLoading, hideLoading } from '../components/loading.js';

export default async function viewRegister() {
  const container = createEl('div', 'register-container');

  const title = createEl('h2', null, 'Registro de Usuario');
  const form = createEl('form', 'register-form');

  const nombreInput = createEl('input');
  nombreInput.type = 'text';
  nombreInput.placeholder = 'Nombre de usuario';
  nombreInput.name = 'nombre';

  const emailInput = createEl('input');
  emailInput.type = 'email';
  emailInput.placeholder = 'Email';
  emailInput.name = 'email';

  const passwordInput = createEl('input');
  passwordInput.type = 'password';
  passwordInput.placeholder = 'Contraseña';
  passwordInput.name = 'password';

  const repeatPasswordInput = createEl('input');
  repeatPasswordInput.type = 'password';
  repeatPasswordInput.placeholder = 'Repetir contraseña';
  repeatPasswordInput.name = 'repeatPassword';

  const submitBtn = createEl('button', 'submit-btn', 'Registrarse');
  submitBtn.type = 'submit';

  const message = createEl('p', 'message');

  form.append(
    nombreInput,
    emailInput,
    passwordInput,
    repeatPasswordInput,
    submitBtn,
    message
  );
  container.append(title, form);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = nombreInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const repeatPassword = repeatPasswordInput.value.trim();

    if (password !== repeatPassword) {
      message.textContent = 'Las contraseñas no coinciden';
      return;
    }

    if (password.length < 6) {
      message.textContent = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    const nombreValido = /^[a-zA-Z0-9]+$/.test(nombre);
    if (!nombreValido) {
      message.textContent = 'El nombre solo puede contener letras y números, sin espacios ni símbolos.';
      return;
    }

    const emailValido = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
    if (!emailValido) {
      message.textContent = 'Introduce un correo electrónico válido';
      return;
    }

    try {
      showLoading();
      const res = await apiFetch('/users/register', {
        method: 'POST',
        body: { nombre, email, password }
      });
      hideLoading();

      sessionStorage.setItem('token', res.token);
      sessionStorage.setItem('role', res.role || 'user');
      location.hash = '#home';

    } catch (err) {
      hideLoading();
      console.error('Error al registrar:', err);
      message.textContent = err.message || 'Error al registrarse';
    }
  });

  return container;
}

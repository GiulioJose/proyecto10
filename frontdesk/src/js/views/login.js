import { createEl } from '../utils/createElements.js';
import { handleLogin } from '../auth/login.js';

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

    await handleLogin(email, password, message);
  });

  return container;
}

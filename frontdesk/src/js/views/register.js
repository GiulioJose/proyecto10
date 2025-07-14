import { createEl } from '../utils/createElements.js';
import { handleRegister } from '../auth/register.js';

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

    await handleRegister(nombre, email, password, message);
  });

  return container;
}

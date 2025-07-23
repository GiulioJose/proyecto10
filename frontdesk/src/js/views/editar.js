import { createEl } from '../utils/createElements.js';
import { showLoading, hideLoading } from '../components/loading.js';
import { apiFetch } from '../utils/apiFetch.js';
import { createBackButton } from '../components/backButton.js';

export default function viewEditar() {
  showLoading();

  const obra = JSON.parse(sessionStorage.getItem('obraEditar'));

  if (!obra || !obra._id) {
    const fallback = createEl('div', 'view');
    fallback.textContent = 'No hay datos para editar.';
    hideLoading();
    return fallback;
  }

  const container = createEl('div', ['view', 'subir-view']);

  // ✅ Botón de volver (componente)
  container.appendChild(createBackButton());

  const contentRow = createEl('div', 'subir-content');

  // Vista previa
  const figure = createEl('figure', 'subir-preview');

  const img = createEl('img');
  img.alt = 'Previsualización';
  img.src = obra.imagen;
  img.style.display = 'block';

  const cambiarBtn = createEl('button', 'cambiar-imagen-btn', 'Cambiar imagen');
  cambiarBtn.type = 'button';
  cambiarBtn.style.display = 'inline-block';

  cambiarBtn.addEventListener('click', () => {
    img.src = '';
    img.style.display = 'none';
    figure.style.display = 'none';
    cambiarBtn.style.display = 'none';
    dropzone.style.display = 'flex';
    fileInput.value = '';
  });

  figure.append(img, cambiarBtn);

  const dropzone = createEl('div', 'dropzone');
  dropzone.style.display = 'none';

  const dropText = createEl('p', null, 'Arrastrá una imagen aquí o haz clic');
  const fileInput = createEl('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  fileInput.hidden = true;

  dropzone.append(dropText, fileInput);

  dropzone.addEventListener('click', () => fileInput.click());
  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });
  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('dragover');
  });
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  });
  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) handleFile(file);
  });

  function handleFile(file) {
    const url = URL.createObjectURL(file);
    img.src = url;
    img.style.display = 'block';
    figure.style.display = 'block';
    cambiarBtn.style.display = 'inline-block';
    dropzone.style.display = 'none';
  }

  const form = createEl('form', 'subir-form');

  const campos = ['titulo', 'autor', 'ano', 'siglo', 'pais', 'continente', 'corriente'];
  const inputs = {};

  campos.forEach((name) => {
    const input = createEl('input');
    input.name = name;
    input.placeholder = name === 'ano' ? 'Año' : name.charAt(0).toUpperCase() + name.slice(1);
    input.required = true;

    const obraKey = name === 'ano' ? 'año' : name;
    input.value = obra[obraKey] || '';

    form.appendChild(input);
    inputs[name] = input;
  });

  const submitBtn = createEl('button', ['info-action-btn', 'is-warning'], 'Guardar cambios');
  submitBtn.type = 'submit';
  form.appendChild(submitBtn);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const file = fileInput.files[0];
    let body, options;

    if (file) {
      body = new FormData();
      campos.forEach((name) => {
        body.append(name, inputs[name].value);
      });
      body.append('imagen', file);
      options = {
        method: 'PATCH',
        body,
        isFormData: true,
      };
    } else {
      const data = {};
      campos.forEach((name) => {
        data[name] = inputs[name].value;
      });
      body = data;
      options = {
        method: 'PATCH',
        body,
      };
    }

    try {
      showLoading();
      const res = await apiFetch(`/obras/${obra._id}`, options);
      alert(res.message || 'Obra actualizada correctamente.');
      sessionStorage.setItem('obra', JSON.stringify(res.obra));
      location.hash = '#info';
    } catch (err) {
      console.error('Error al editar:', err);
      alert(err.message || 'Error al actualizar la obra.');
    } finally {
      hideLoading();
    }
  });

  contentRow.append(figure, dropzone, form);
  container.append(contentRow);

  hideLoading();
  return container;
}

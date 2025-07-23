import { createEl } from '../utils/createElements.js';
import { showLoading, hideLoading } from '../components/loading.js';
import { apiFetch } from '../utils/apiFetch.js';

export default function viewSubir() {
  const container = createEl('div', ['view', 'subir-view']);
  const contentRow = createEl('div', 'subir-content');

  // Vista previa
  const figure = createEl('figure', 'subir-preview');
  figure.style.display = 'none';

  const img = createEl('img');
  img.alt = 'Previsualización';
  img.style.display = 'none';

  const cambiarBtn = createEl('button', 'cambiar-imagen-btn', 'Cambiar imagen');
  cambiarBtn.type = 'button';
  cambiarBtn.style.display = 'none';

  cambiarBtn.addEventListener('click', () => {
    img.src = '';
    img.style.display = 'none';
    figure.style.display = 'none';
    cambiarBtn.style.display = 'none';
    dropzone.style.display = 'flex';
    fileInput.value = '';
  });

  figure.append(img, cambiarBtn);

  // Dropzone
  const dropzone = createEl('div', 'dropzone');
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

  // Formulario
  const form = createEl('form', 'subir-form');

  const campos = [
    'titulo',
    'autor',
    'ano',        // Internamente sigue siendo "ano"
    'siglo',
    'pais',
    'continente',
    'corriente',
  ];

  const inputs = {};
  campos.forEach((name) => {
    const input = createEl('input');
    input.name = name;
    input.placeholder = name === 'ano' ? 'Año' : name.charAt(0).toUpperCase() + name.slice(1);
    input.required = true;
    form.appendChild(input);
    inputs[name] = input;
  });

  const submitBtn = createEl('button', ['info-action-btn', 'is-success'], 'Subir obra');
  submitBtn.type = 'submit';
  form.appendChild(submitBtn);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const file = fileInput.files[0];
    if (!file) {
      alert('Debés subir una imagen.');
      return;
    }

    const formData = new FormData();
    campos.forEach((name) => {
      formData.append(name, inputs[name].value);
    });

    formData.append('imagen', file);
    formData.append('subidaPor', sessionStorage.getItem('userId'));

    try {
      showLoading();
      const res = await apiFetch('/obras', {
        method: 'POST',
        body: formData,
        isFormData: true,
      });

      alert(res.message || 'Obra subida correctamente.');
      location.hash = '#misobras';
    } catch (err) {
      console.error('Error en subida:', err);
      alert(err.message || 'Error al subir la obra.');
    } finally {
      hideLoading();
    }
  });

  contentRow.append(figure, dropzone, form);
  container.append(contentRow);
  return container;
}

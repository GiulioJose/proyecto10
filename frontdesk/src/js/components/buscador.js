import { renderGallery } from './gallery.js';
import { createEl } from '../utils/createElements.js';

function normalizar(texto) {
  return texto
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function initBuscador(input, galleryWrapper, obras) {
  // Crear contenedor de sugerencias
  let sugerenciasEl = document.querySelector('.sugerencias');
  if (!sugerenciasEl) {
    sugerenciasEl = document.createElement('ul');
    sugerenciasEl.className = 'sugerencias';
    input.parentNode.appendChild(sugerenciasEl);
  }

  const mensajeVacio = () =>
    createEl('p', 'mensaje-vacio', 'No se encontraron resultados.');

  const filtrarObras = (query) => {
    const texto = normalizar(query);

    return obras.filter((obra) => {
      return (
        normalizar(obra.titulo).includes(texto) ||
        normalizar(obra.autor).includes(texto) ||
        normalizar(obra.corriente).includes(texto) ||
        normalizar(obra.pais).includes(texto) ||
        normalizar(obra.continente).includes(texto) ||
        normalizar(obra.siglo).includes(texto) ||
        obra.año?.toString().includes(texto)
      );
    });
  };

  const renderSugerencias = (resultados, query) => {
    sugerenciasEl.innerHTML = '';
    const max = 10;
    const texto = normalizar(query);

    resultados.slice(0, max).forEach((obra) => {
      let coincidencia = null;

      if (normalizar(obra.titulo).includes(texto)) {
        coincidencia = { valor: obra.titulo, campo: 'título' };
      } else if (normalizar(obra.autor).includes(texto)) {
        coincidencia = { valor: obra.autor, campo: 'autor' };
      } else if (normalizar(obra.corriente).includes(texto)) {
        coincidencia = { valor: obra.corriente, campo: 'corriente' };
      } else if (normalizar(obra.pais).includes(texto)) {
        coincidencia = { valor: obra.pais, campo: 'país' };
      } else if (normalizar(obra.continente).includes(texto)) {
        coincidencia = { valor: obra.continente, campo: 'continente' };
      } else if (normalizar(obra.siglo).includes(texto)) {
        coincidencia = { valor: obra.siglo, campo: 'siglo' };
      } else if (obra.año?.toString().includes(texto)) {
        coincidencia = { valor: obra.año, campo: 'año' };
      }

      if (coincidencia) {
        const li = document.createElement('li');
        li.className = 'sugerencia-item';
        li.textContent = `${coincidencia.valor} (${coincidencia.campo})`;
        li.addEventListener('click', () => {
          input.value = coincidencia.valor;
          sugerenciasEl.innerHTML = '';
          galleryWrapper.innerHTML = '';
          renderGallery({ obras: [obra] }, galleryWrapper);
        });
        sugerenciasEl.appendChild(li);
      }
    });

    sugerenciasEl.style.display = resultados.length ? 'block' : 'none';
  };

  input.addEventListener('input', () => {
    const query = input.value.trim();
    const resultados = query ? filtrarObras(query) : obras;

    galleryWrapper.innerHTML = '';
    if (resultados.length) {
      renderGallery({ obras: resultados }, galleryWrapper);
    } else {
      galleryWrapper.appendChild(mensajeVacio());
    }

    if (query && resultados.length) {
      renderSugerencias(resultados, query);
    } else {
      sugerenciasEl.innerHTML = '';
      sugerenciasEl.style.display = 'none';
    }
  });
}

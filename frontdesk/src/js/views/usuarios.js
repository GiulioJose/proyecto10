import { createEl } from '../utils/createElements.js';
import { apiFetch } from '../utils/apiFetch.js';
import { showLoading, hideLoading } from '../components/loading.js';

export default async function viewUsuarios() {
  showLoading();

  const container = createEl('div', ['view', 'usuarios-view']);

  const role = sessionStorage.getItem('role');
  if (role !== 'admin') {
    container.textContent = 'Acceso no autorizado.';
    hideLoading();
    return container;
  }

  try {
    const usuarios = await apiFetch('/users');

    if (!usuarios.length) {
      container.textContent = 'No hay usuarios registrados.';
      hideLoading();
      return container;
    }

    const table = createEl('table');
    const thead = createEl('thead');
    const tbody = createEl('tbody');

    const headerRow = createEl('tr');
    ['Nombre', 'Email', 'Obras', 'Rol', 'Acciones'].forEach(text => {
      const th = createEl('th', null, text);
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);

    usuarios.forEach((usuario) => {
      const row = createEl('tr');

      const nombre = createEl('td', null, usuario.nombre);
      const email = createEl('td', null, usuario.email);
      const obras = createEl('td', null, usuario.obrasAprobadas?.toString() || '0');

      const rol = createEl('td');
      const rolTexto = createEl('span', null, usuario.rol || '—');
      const btnRol = createEl('button', ['btn', 'btn-secondary'], '🔄');
      btnRol.style.marginLeft = '0.5rem';
      btnRol.addEventListener('click', async () => {
        const nuevoRol = usuario.rol === 'admin' ? 'user' : 'admin';
        try {
          const res = await apiFetch(`/users/${usuario._id}/role`, {
            method: 'PATCH',
            body: { rol: nuevoRol },
          });
          alert(res.message || 'Rol actualizado.');
          rolTexto.textContent = nuevoRol;
          usuario.rol = nuevoRol;
        } catch (err) {
          alert('Error al cambiar rol');
        }
      });
      rol.append(rolTexto, btnRol);

      const acciones = createEl('td');
      const btnEliminar = createEl('button', ['btn', 'btn-error'], '🗑️');
      btnEliminar.addEventListener('click', async () => {
        if (confirm(`¿Eliminar a ${usuario.nombre}?`)) {
          try {
            await apiFetch(`/users/${usuario._id}`, { method: 'DELETE' });
            row.remove();
          } catch (err) {
            alert('Error al eliminar usuario');
          }
        }
      });
      acciones.appendChild(btnEliminar);

      row.append(nombre, email, obras, rol, acciones);
      tbody.appendChild(row);
    });

    table.append(thead, tbody);
    container.appendChild(table);
  } catch (err) {
    container.textContent = 'Error al cargar usuarios.';
  } finally {
    hideLoading();
  }

  return container;
}

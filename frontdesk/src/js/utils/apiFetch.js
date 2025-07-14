export const apiFetch = async (endpoint, options = {}) => {
  const res = await fetch(import.meta.env.VITE_API_URL + endpoint, {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(sessionStorage.getItem('token') && {
        Authorization: 'Bearer ' + sessionStorage.getItem('token'),
      }),
    },
    body: options.body ? JSON.stringify(options.body) : null,
  });

  const data = await res.json();

  if (!res.ok) {
    const error = new Error(data.message || 'Error en la petición');
    error.status = res.status;
    throw error;
  }

  return data;
};

// Comunicación con el backend. Toda la información pasa por /api/proyectos
const api = (() => {
  const URL_BASE = '/api/proyectos';

  async function solicitar(url, opciones = {}) {
    let respuesta;
    try {
      respuesta = await fetch(url, {
        headers: { 'Content-Type': 'application/json' },
        ...opciones,
      });
    } catch {
      throw { mensaje: 'No se pudo conectar con el servidor.', errores: [] };
    }

    const datos = await respuesta.json().catch(() => ({}));
    if (!respuesta.ok) {
      throw {
        status: respuesta.status,
        mensaje: datos.mensaje || 'Ocurrió un error.',
        errores: datos.errores || [],
      };
    }
    return datos;
  }

  return {
    listar: () => solicitar(URL_BASE),
    buscar: (codigo) => solicitar(`${URL_BASE}/${encodeURIComponent(codigo)}`),
    registrar: (proyecto) => solicitar(URL_BASE, { method: 'POST', body: JSON.stringify(proyecto) }),
    eliminar: (codigo) => solicitar(`${URL_BASE}/${encodeURIComponent(codigo)}`, { method: 'DELETE' }),
  };
})();

const formulario = document.getElementById('formProyecto');
const formBuscar = document.getElementById('formBuscar');
const inputBuscar = document.getElementById('buscarCodigo');
const btnVerTodos = document.getElementById('btnVerTodos');
const avisoBusqueda = document.getElementById('avisoBusqueda');
const cuerpoTabla = document.getElementById('tablaProyectos');
const tablaVacia = document.getElementById('tablaVacia');
const dialogo = document.getElementById('dialogoEliminar');
const notificacion = document.getElementById('notificacion');

const CAMPOS = ['codigo', 'cliente', 'tipoDiseno', 'horas', 'costoHora'];
let codigoPorEliminar = null;

const formatoMonto = new Intl.NumberFormat('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const soles = (valor) => `S/ ${formatoMonto.format(valor)}`;

// ---------- Mensajes ----------

let temporizador;
function notificar(mensaje, tipo = 'exito') {
  notificacion.textContent = mensaje;
  notificacion.className = `notificacion visible ${tipo}`;
  clearTimeout(temporizador);
  temporizador = setTimeout(() => notificacion.classList.remove('visible'), 3500);
}

function mostrarAviso(mensaje, tipo) {
  avisoBusqueda.textContent = mensaje;
  avisoBusqueda.className = `aviso ${tipo}`;
  avisoBusqueda.hidden = false;
}

// ---------- Validación del formulario ----------

function marcarError(campo, mensaje) {
  const input = document.getElementById(campo);
  document.getElementById(`error-${campo}`).textContent = mensaje;
  input.classList.toggle('invalido', Boolean(mensaje));
  input.setAttribute('aria-invalid', mensaje ? 'true' : 'false');
}

function limpiarErrores() {
  CAMPOS.forEach((campo) => marcarError(campo, ''));
}

function leerFormulario() {
  return {
    codigo: formulario.codigo.value.trim().toUpperCase(),
    cliente: formulario.cliente.value.trim(),
    tipoDiseno: formulario.tipoDiseno.value,
    horas: formulario.horas.value,
    costoHora: formulario.costoHora.value,
  };
}

function validar(datos) {
  const errores = {};

  if (!datos.codigo) errores.codigo = 'El código es obligatorio.';
  else if (!/^[A-Z0-9-]{3,15}$/.test(datos.codigo)) errores.codigo = 'Use de 3 a 15 letras, números o guiones.';

  if (!datos.cliente) errores.cliente = 'El nombre del cliente es obligatorio.';

  if (!datos.tipoDiseno) errores.tipoDiseno = 'Seleccione el tipo de diseño.';

  if (datos.horas === '') errores.horas = 'Las horas trabajadas son obligatorias.';
  else if (Number(datos.horas) <= 0) errores.horas = 'Las horas deben ser mayores que cero.';

  if (datos.costoHora === '') errores.costoHora = 'El costo por hora es obligatorio.';
  else if (Number(datos.costoHora) <= 0) errores.costoHora = 'El costo por hora debe ser mayor que cero.';

  return errores;
}

// ---------- Tabla y reporte ----------

function crearCelda(texto, clase) {
  const celda = document.createElement('td');
  celda.textContent = texto;
  if (clase) celda.className = clase;
  return celda;
}

function pintarTabla(proyectos, mensajeVacio = 'Aún no hay proyectos registrados.') {
  cuerpoTabla.replaceChildren();
  tablaVacia.textContent = mensajeVacio;
  tablaVacia.hidden = proyectos.length > 0;

  proyectos.forEach((p) => {
    const fila = document.createElement('tr');
    fila.append(
      crearCelda(p.codigo, 'codigo'),
      crearCelda(p.cliente),
      crearCelda(p.tipoDiseno),
      crearCelda(formatoMonto.format(p.horas), 'numero'),
      crearCelda(soles(p.costoHora), 'numero'),
      crearCelda(soles(p.valorTotal), 'numero total'),
    );

    const celdaAccion = document.createElement('td');
    celdaAccion.className = 'accion';
    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'boton boton-eliminar';
    boton.textContent = 'Eliminar';
    boton.setAttribute('aria-label', `Eliminar proyecto ${p.codigo}`);
    boton.addEventListener('click', () => pedirConfirmacion(p.codigo));
    celdaAccion.append(boton);
    fila.append(celdaAccion);

    cuerpoTabla.append(fila);
  });
}

function pintarResumen(resumen) {
  document.getElementById('totalProyectos').textContent = resumen.cantidad;
  document.getElementById('facturacionTotal').textContent = soles(resumen.facturacionTotal);
  document.getElementById('promedio').textContent = soles(resumen.promedio);
}

async function cargarProyectos() {
  try {
    const { proyectos, resumen } = await api.listar();
    pintarTabla(proyectos);
    pintarResumen(resumen);
  } catch (error) {
    notificar(error.mensaje, 'error');
  }
}

// ---------- Registrar ----------

formulario.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  limpiarErrores();

  const datos = leerFormulario();
  const errores = validar(datos);
  const camposConError = Object.keys(errores);

  if (camposConError.length) {
    camposConError.forEach((campo) => marcarError(campo, errores[campo]));
    document.getElementById(camposConError[0]).focus();
    return;
  }

  const boton = document.getElementById('btnRegistrar');
  boton.disabled = true;
  try {
    const respuesta = await api.registrar(datos);
    notificar(respuesta.mensaje);
    formulario.reset();
    salirDeBusqueda();
    await cargarProyectos();
    formulario.codigo.focus();
  } catch (error) {
    error.errores.forEach((e) => marcarError(e.campo, e.mensaje));
    notificar(error.mensaje, 'error');
  } finally {
    boton.disabled = false;
  }
});

document.getElementById('btnLimpiar').addEventListener('click', () => {
  formulario.reset();
  limpiarErrores();
  formulario.codigo.focus();
});

// ---------- Buscar ----------

function salirDeBusqueda() {
  inputBuscar.value = '';
  avisoBusqueda.hidden = true;
  btnVerTodos.hidden = true;
}

formBuscar.addEventListener('submit', async (evento) => {
  evento.preventDefault();
  const codigo = inputBuscar.value.trim().toUpperCase();

  if (!codigo) {
    mostrarAviso('Ingrese un código de proyecto para buscar.', 'error');
    inputBuscar.focus();
    return;
  }

  btnVerTodos.hidden = false;
  try {
    const proyecto = await api.buscar(codigo);
    pintarTabla([proyecto]);
    mostrarAviso(`Se encontró el proyecto ${proyecto.codigo}.`, 'exito');
  } catch (error) {
    pintarTabla([], 'Sin resultados para la búsqueda.');
    mostrarAviso(error.mensaje, 'error');
  }
});

btnVerTodos.addEventListener('click', () => {
  salirDeBusqueda();
  cargarProyectos();
});

// ---------- Eliminar (con confirmación) ----------

function pedirConfirmacion(codigo) {
  codigoPorEliminar = codigo;
  document.getElementById('codigoEliminar').textContent = codigo;
  dialogo.showModal();
}

document.getElementById('btnCancelarEliminar').addEventListener('click', () => dialogo.close());

document.getElementById('btnConfirmarEliminar').addEventListener('click', async () => {
  dialogo.close();
  try {
    const respuesta = await api.eliminar(codigoPorEliminar);
    notificar(respuesta.mensaje);
    salirDeBusqueda();
    await cargarProyectos();
  } catch (error) {
    notificar(error.mensaje, 'error');
  }
});

cargarProyectos();

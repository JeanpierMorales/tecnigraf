const TIPOS_DISENO = [
  'Branding',
  'Logotipo',
  'Packaging',
  'Diseño editorial',
  'Publicidad digital',
  'Diseño web / UI',
  'Ilustración',
];

const PATRON_CODIGO = /^[A-Z0-9-]{3,15}$/;

const texto = (valor) => (typeof valor === 'string' ? valor.trim() : '');

const estaVacio = (valor) => valor === '' || valor === null || valor === undefined;

const normalizarCodigo = (valor) => texto(valor).toUpperCase();

function numero(valor) {
  return estaVacio(valor) ? NaN : Number(valor);
}

// Se valida aquí aunque el formulario ya valide: el servidor no confía en el navegador
function validarProyecto(body = {}) {
  const errores = [];
  const datos = {
    codigo: normalizarCodigo(body.codigo),
    cliente: texto(body.cliente),
    tipoDiseno: texto(body.tipoDiseno),
    horas: numero(body.horas),
    costoHora: numero(body.costoHora),
  };

  if (!datos.codigo) {
    errores.push({ campo: 'codigo', mensaje: 'El código es obligatorio.' });
  } else if (!PATRON_CODIGO.test(datos.codigo)) {
    errores.push({ campo: 'codigo', mensaje: 'Use de 3 a 15 letras, números o guiones.' });
  }

  if (!datos.cliente) {
    errores.push({ campo: 'cliente', mensaje: 'El nombre del cliente es obligatorio.' });
  } else if (datos.cliente.length > 100) {
    errores.push({ campo: 'cliente', mensaje: 'Máximo 100 caracteres.' });
  }

  if (!datos.tipoDiseno) {
    errores.push({ campo: 'tipoDiseno', mensaje: 'Seleccione el tipo de diseño.' });
  } else if (!TIPOS_DISENO.includes(datos.tipoDiseno)) {
    errores.push({ campo: 'tipoDiseno', mensaje: 'El tipo de diseño no es válido.' });
  }

  if (estaVacio(body.horas)) {
    errores.push({ campo: 'horas', mensaje: 'Las horas trabajadas son obligatorias.' });
  } else if (Number.isNaN(datos.horas)) {
    errores.push({ campo: 'horas', mensaje: 'Ingrese un número válido.' });
  } else if (datos.horas <= 0) {
    errores.push({ campo: 'horas', mensaje: 'Las horas deben ser mayores que cero.' });
  } else if (datos.horas > 10000) {
    errores.push({ campo: 'horas', mensaje: 'Ingrese un máximo de 10 000 horas.' });
  }

  if (estaVacio(body.costoHora)) {
    errores.push({ campo: 'costoHora', mensaje: 'El costo por hora es obligatorio.' });
  } else if (Number.isNaN(datos.costoHora)) {
    errores.push({ campo: 'costoHora', mensaje: 'Ingrese un número válido.' });
  } else if (datos.costoHora <= 0) {
    errores.push({ campo: 'costoHora', mensaje: 'El costo por hora debe ser mayor que cero.' });
  } else if (datos.costoHora > 100000) {
    errores.push({ campo: 'costoHora', mensaje: 'Ingrese un costo menor a 100 000.' });
  }

  return { datos, errores };
}

module.exports = { validarProyecto, normalizarCodigo, TIPOS_DISENO };

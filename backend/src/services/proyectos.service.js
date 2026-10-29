const repository = require('../repositories/proyectos.repository');
const { validarProyecto, normalizarCodigo } = require('../validators/proyecto.validator');
const AppError = require('../utils/AppError');

const redondear = (valor) => Math.round(valor * 100) / 100;

// Valor total = horas trabajadas x costo por hora (se calcula siempre en el servidor)
function conValorTotal(fila) {
  const horas = Number(fila.horas);
  const costoHora = Number(fila.costo_hora);

  return {
    codigo: fila.codigo,
    cliente: fila.cliente,
    tipoDiseno: fila.tipo_diseno,
    horas: redondear(horas),
    costoHora: redondear(costoHora),
    valorTotal: redondear(horas * costoHora),
  };
}

function calcularResumen(proyectos) {
  const cantidad = proyectos.length;
  const facturacionTotal = proyectos.reduce((suma, p) => suma + p.valorTotal, 0);

  return {
    cantidad,
    facturacionTotal: redondear(facturacionTotal),
    promedio: cantidad ? redondear(facturacionTotal / cantidad) : 0,
  };
}

async function listarConResumen() {
  const filas = await repository.listar();
  const proyectos = filas.map(conValorTotal);
  return { proyectos, resumen: calcularResumen(proyectos) };
}

async function buscarPorCodigo(codigoIngresado) {
  const codigo = normalizarCodigo(codigoIngresado);
  if (!codigo) {
    throw new AppError(400, 'Ingrese un código de proyecto para buscar.');
  }

  const fila = await repository.buscarPorCodigo(codigo);
  if (!fila) {
    throw new AppError(404, `No se encontró ningún proyecto con el código ${codigo}.`);
  }
  return conValorTotal(fila);
}

async function registrar(body) {
  const { datos, errores } = validarProyecto(body);
  if (errores.length) {
    throw new AppError(400, 'Revise los datos del formulario.', errores);
  }

  const existente = await repository.buscarPorCodigo(datos.codigo);
  if (existente) {
    throw new AppError(409, `El código ${datos.codigo} ya está registrado.`, [
      { campo: 'codigo', mensaje: 'Este código ya existe.' },
    ]);
  }

  const fila = await repository.crear({
    codigo: datos.codigo,
    cliente: datos.cliente,
    tipo_diseno: datos.tipoDiseno,
    horas: datos.horas,
    costo_hora: datos.costoHora,
  });
  return conValorTotal(fila);
}

async function eliminar(codigoIngresado) {
  const codigo = normalizarCodigo(codigoIngresado);
  const eliminado = await repository.eliminar(codigo);
  if (!eliminado) {
    throw new AppError(404, `No se encontró ningún proyecto con el código ${codigo}.`);
  }
}

module.exports = { listarConResumen, buscarPorCodigo, registrar, eliminar };

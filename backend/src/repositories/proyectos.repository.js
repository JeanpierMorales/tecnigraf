const supabase = require('../config/supabase');
const AppError = require('../utils/AppError');

const TABLA = 'proyectos';
const COLUMNAS = 'codigo, cliente, tipo_diseno, horas, costo_hora';

// Único lugar que conoce la base de datos: si cambia el motor, solo se toca este archivo
function revisar(error) {
  if (!error) return;
  if (error.code === '23505') {
    throw new AppError(409, 'El código ya está registrado.', [
      { campo: 'codigo', mensaje: 'Este código ya existe.' },
    ]);
  }
  console.error('Error de base de datos:', error.message);
  throw new AppError(500, 'No se pudo completar la operación en la base de datos.');
}

async function listar() {
  const { data, error } = await supabase
    .from(TABLA)
    .select(COLUMNAS)
    .order('creado_en', { ascending: false });
  revisar(error);
  return data;
}

async function buscarPorCodigo(codigo) {
  const { data, error } = await supabase
    .from(TABLA)
    .select(COLUMNAS)
    .eq('codigo', codigo)
    .maybeSingle();
  revisar(error);
  return data;
}

async function crear(proyecto) {
  const { data, error } = await supabase
    .from(TABLA)
    .insert(proyecto)
    .select(COLUMNAS)
    .single();
  revisar(error);
  return data;
}

async function eliminar(codigo) {
  const { data, error } = await supabase
    .from(TABLA)
    .delete()
    .eq('codigo', codigo)
    .select('codigo');
  revisar(error);
  return data.length > 0;
}

module.exports = { listar, buscarPorCodigo, crear, eliminar };

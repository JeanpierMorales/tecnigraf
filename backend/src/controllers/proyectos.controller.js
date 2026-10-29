const service = require('../services/proyectos.service');

// Los controladores solo reciben la petición y responden; la lógica está en el servicio

async function listar(req, res, next) {
  try {
    const datos = await service.listarConResumen();
    res.json(datos);
  } catch (error) {
    next(error);
  }
}

async function buscar(req, res, next) {
  try {
    const proyecto = await service.buscarPorCodigo(req.params.codigo);
    res.json(proyecto);
  } catch (error) {
    next(error);
  }
}

async function registrar(req, res, next) {
  try {
    const proyecto = await service.registrar(req.body);
    res.status(201).json({ mensaje: 'Proyecto registrado correctamente.', proyecto });
  } catch (error) {
    next(error);
  }
}

async function eliminar(req, res, next) {
  try {
    await service.eliminar(req.params.codigo);
    res.json({ mensaje: 'Proyecto eliminado correctamente.' });
  } catch (error) {
    next(error);
  }
}

module.exports = { listar, buscar, registrar, eliminar };

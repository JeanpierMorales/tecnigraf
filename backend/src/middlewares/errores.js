const AppError = require('../utils/AppError');

function rutaNoEncontrada(req, res, next) {
  next(new AppError(404, 'La ruta solicitada no existe.'));
}

// eslint-disable-next-line no-unused-vars
function manejarErrores(error, req, res, next) {
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ mensaje: 'El formato de los datos no es válido.' });
  }

  if (error instanceof AppError) {
    return res.status(error.status).json({ mensaje: error.message, errores: error.errores });
  }

  // Los errores inesperados no se muestran al usuario
  console.error(error);
  res.status(500).json({ mensaje: 'Ocurrió un error inesperado en el servidor.' });
}

module.exports = { rutaNoEncontrada, manejarErrores };

// Error controlado: lleva el código HTTP y, si aplica, el detalle por campo
class AppError extends Error {
  constructor(status, mensaje, errores = []) {
    super(mensaje);
    this.status = status;
    this.errores = errores;
  }
}

module.exports = AppError;

const path = require('path');
const express = require('express');

const proyectosRoutes = require('./routes/proyectos.routes');
const seguridad = require('./middlewares/seguridad');
const { rutaNoEncontrada, manejarErrores } = require('./middlewares/errores');

const app = express();

app.disable('x-powered-by');
app.use(seguridad);
app.use(express.json({ limit: '10kb' }));

// El mismo servidor entrega la interfaz web
app.use(express.static(path.join(__dirname, '..', '..', 'frontend')));

app.use('/api/proyectos', proyectosRoutes);

app.use('/api', rutaNoEncontrada);
app.use(manejarErrores);

module.exports = app;

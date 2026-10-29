const { Router } = require('express');
const controller = require('../controllers/proyectos.controller');

const router = Router();

router.get('/', controller.listar);
router.get('/:codigo', controller.buscar);
router.post('/', controller.registrar);
router.delete('/:codigo', controller.eliminar);

module.exports = router;

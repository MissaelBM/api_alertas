const express = require('express');
const movimientoController = require('../controllers/movimiento');

const router = express.Router();

module.exports = (connection) => {
  const controller = movimientoController(connection);

  router.post('/movimiento', controller.modulo);
  router.get('/movimiento', controller.consultar);
  router.get('/movimiento/:id', controller.consultarId);
  router.patch('/movimiento/:id', controller.actualizarModulo);
  router.delete('/movimiento/:id', controller.eliminarModulo); 

  return router;
};
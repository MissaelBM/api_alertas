const express = require('express');
const guardadoController = require('../controllers/guardado');

const router = express.Router();

module.exports = (connection) => {
  const controller = guardadoController(connection);

  router.post('/guardado', controller.guardado);
  router.get('/guardado', controller.consultar);
  router.get('/guardado/:id', controller.consultarId);
  router.patch('/guardado/:id', controller.actualizarGuardado);
 

  return router;
};
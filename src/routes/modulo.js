const express = require('express');
const moduloController = require('../controllers/modulo');

const router = express.Router();

module.exports = (connection) => {
  const controller = moduloController(connection);

  router.post('/modulo', controller.notificacion);
  router.get('/modulo', controller.consultar);
  router.get('/modulo/:id', controller.consultarId);
  router.patch('/modulo/:id', controller.actualizarNotificacion);
  router.delete('/modulo/:id', controller.eliminarNotificacion); 

  return router;
};
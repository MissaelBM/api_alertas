const express = require('express');
const empresaController = require('../controllers/notificacion');

const router = express.Router();

module.exports = (connection) => {
  const controller = empresaController(connection);

  router.post('/notificacion', controller.notificacion);
  router.get('/notificacion', controller.consultar);
  router.get('/notificacion/:id', controller.consultarId);
  router.patch('/notificacion/:id', controller.actualizarEmpresa);
 

  return router;
};
const express = require('express');
const empresaController = require('../controllers/empresa');

const router = express.Router();

module.exports = (connection) => {
  const controller = empresaController(connection);

  router.post('/empresa', controller.empresa);
  router.get('/empresa', controller.consultar);
  router.get('/empresa/:id', controller.consultarId);
  router.patch('/empresa/:id', controller.actualizarEmpresa);
 

  return router;
};
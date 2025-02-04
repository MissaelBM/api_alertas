const express = require('express');
const rolController = require('../controllers/empresa');

const router = express.Router();

module.exports = (connection) => {
  const controller = rolController(connection);

  router.post('/empresa', controller.empresa);
  router.get('/empresa', controller.consultar);
  router.get('/empresa/:id', controller.consultarId);
  router.patch('/empresa/:id', controller.actualizarEmpresa);
 

  return router;
};
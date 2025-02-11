const express = require('express');
const guardadoController = require('../controllers/metododepago');

const router = express.Router();

module.exports = (connection) => {
  const controller = guardadoController(connection);

  router.post('/metododepago', controller.metododepago);
  router.get('/metododepago', controller.consultar);
  router.get('/metododepago/:id', controller.consultarId);
  router.patch('/metododepago/:id', controller.actualizarMetododepago);
 

  return router;
};
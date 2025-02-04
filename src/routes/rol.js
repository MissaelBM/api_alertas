const express = require('express');
const rolController = require('../controllers/rol');

const router = express.Router();

module.exports = (connection) => {
  const controller = rolController(connection);

  router.post('/rol', controller.rol);
  router.get('/rol', controller.consultar);
  router.get('/rol/:id', controller.consultarId);
  router.patch('/rol/:id', controller.actualizarRol);
 

  return router;
};
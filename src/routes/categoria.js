const express = require('express');
const categoriaController = require('../controllers/categoria');

const router = express.Router();

module.exports = (connection) => {
  const controller = categoriaController(connection);

  router.post('/categoria', controller.empresa);
  router.get('/categoria', controller.consultar);
  router.get('/categoria/:id', controller.consultarId);
  router.patch('/categoria/:id', controller.actualizarCategoria);
 

  return router;
};
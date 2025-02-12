const express = require('express');
const clienteController = require('../controllers/cliente');

const router = express.Router();

module.exports = (connection) => {
  const controller = categoriaController(connection);

  router.post('/cliente', controller.cliente);
  router.get('/cliente', controller.consultar);
  router.get('/cliente/:id', controller.consultarId);
  router.patch('/cliente/:id', controller.actualizarCategoria);
  router.delete('/cliente/:id', controller.eliminarCategoria);

  return router;
};
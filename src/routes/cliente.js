const express = require('express');
const clienteController = require('../controllers/cliente');

const router = express.Router();

module.exports = (connection) => {
  const controller = clienteController(connection);

  router.post('/cliente', controller.cliente);
  router.get('/cliente', controller.consultar);
  router.get('/cliente/:id', controller.consultarId);
  router.patch('/cliente/:id', controller.actualizarCliente);
  router.delete('/cliente/:id', controller.eliminarCliente);

  return router;
};
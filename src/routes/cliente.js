const express = require('express');
const clienteController = require('../controllers/cliente');

const router = express.Router();

module.exports = (connection) => {
  const controller = clienteController(connection);

  // CRUD Routes
  router.get('/cliente', controller.getClientes); // Obtener todos los clientes
  router.get('/cliente/:id', controller.getClienteById); // Obtener cliente por ID
  router.post('/cliente', controller.createCliente); // Crear un nuevo cliente
  router.put('/cliente/:id', controller.updateCliente); // Actualizar un cliente por ID
  router.delete('/cliente/:id', controller.deleteCliente); // Eliminar un cliente por ID

  return router;
};
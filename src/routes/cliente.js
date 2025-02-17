const express = require('express');
const clienteController = require('../controllers/cliente');

const router = express.Router();

module.exports = (connection) => {
  const controller = clienteController(connection);

  // CRUD Routes
  router.get('/cliente', controller.obtenerClientes); // Obtener todos los clientes
  router.get('/cliente/:id', controller.obtenerClientePorId); // Obtener cliente por ID
  router.post('/cliente', controller.crearCliente); // Crear un nuevo cliente
  router.patch('/cliente/:id', controller.actualizarClientePorId); // Actualizar un cliente por ID
  router.delete('/cliente/:id', controller.eliminarClientePorId); // Eliminar un cliente por ID

  return router;
};
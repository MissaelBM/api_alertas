const express = require('express');
const moduloController = require('../controllers/modulo');

const router = express.Router();

module.exports = (connection) => {
  const controller = moduloController(connection);

  // CRUD Routes
  router.get('/modulo', controller.obtenerModulos); // Obtener todos los módulos
  router.get('/modulo/:id', controller.obtenrModuloPorId); // Obtener módulo por ID
  router.post('/modulo', controller.crearModulo); // Crear un nuevo módulo
  router.patch('/modulo/:id', controller.actualizarModuloPorId); // Actualizar un módulo por ID
  router.delete('/modulo/:id', controller.eliminarModuloPorId); // Eliminar un módulo por ID

  return router;
};

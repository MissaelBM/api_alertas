const express = require('express');
const moduloController = require('../controllers/modulo');

const router = express.Router();

module.exports = (connection) => {
  const controller = moduloController(connection);

  // CRUD Routes
  router.get('/modulo', controller.getModulos); // Obtener todos los módulos
  router.get('/modulo/:id', controller.getModuloById); // Obtener módulo por ID
  router.post('/modulo', controller.createModulo); // Crear un nuevo módulo
  router.patch('/modulo/:id', controller.updateModulo); // Actualizar un módulo por ID
  router.delete('/modulo/:id', controller.deleteModulo); // Eliminar un módulo por ID

  return router;
};

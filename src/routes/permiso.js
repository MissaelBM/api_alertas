const express = require('express');
const permisoController = require('../controllers/permiso');

const router = express.Router();

module.exports = (connection) => {
  const controller = permisoController(connection);

      //btener todos los permisos
      router.get('/permiso', controller.obtenerPermisos);
      //obtener un permiso por ID
      router.get('/permiso/:id', controller.obtenerPermisoPorId);
      //crear un nuevo permiso
      router.post('/permiso', controller.crearPermiso);
      //actualizar un permiso por ID
      router.patch('/permiso/:id', controller.actualizarPermiso);
      //eliminar un permiso por ID (soft delete)
      router.delete('/permiso/:id', controller.eliminarPermiso);

  return router;
};

const express = require('express');
const permisoController = require('../controllers/permiso');

const router = express.Router();

module.exports = (connection) => {
  const controller = permisoController(connection);

  router.post('/permiso', controller.permiso);
  router.get('/permiso', controller.consultar);
  router.get('/permiso/:id', controller.consultarId);
  router.patch('/permiso/:id', controller.actualizarPromocion);
  router.delete('/permiso/:id', controller.eliminarPromocion);

  return router;
};
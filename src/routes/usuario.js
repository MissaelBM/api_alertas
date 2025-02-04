const express = require('express');
const userController = require('../controllers/usuario');

const router = express.Router();

module.exports = (connection) => {
  const controller = userController(connection);

  router.post('/usuario', controller.usuario);
  router.get('/usuario', controller.consultar);
  router.get('/usuario/:id', controller.consultarId);
  router.patch('/usuario/:id', controller.actualizarUsuario);
  router.post('/usuario/login', controller.login);

  return router;
};
const express = require('express');
const userController = require('../controllers/usuario');
const authenticateToken = require('../middleware/auth'); 
const router = express.Router();

module.exports = (connection) => {
  const controller = userController(connection);

  
  router.post('/usuario', controller.usuario);

  
  router.post('/usuario/login', controller.login)
  router.get('/usuario', authenticateToken, controller.consultar); 
  router.get('/usuario/:id', authenticateToken, controller.consultarId); 
  router.patch('/usuario/:id', authenticateToken, controller.actualizarUsuario); 
  router.delete('/usuario/:id', authenticateToken, controller.eliminarUsuario); 

  return router;
};
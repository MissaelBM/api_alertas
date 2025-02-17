const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const userRoutes = require('./src/routes/userRoutes');
const rolRoutes = require('./src/routes/rol');
const permisoRoutes = require('./src/routes/permiso');
const moduloRoutes = require('./src/routes/modulo');
const clienteRoutes = require('./src/routes/cliente');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// Conexión a MySQL
const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'pokoo',
    database: 'alertas'
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar MySQL:', err);
    return;
  }
  console.log('Conectado');
});

// Rutas
app.use('/api', userRoutes(connection));
app.use('/api', rolRoutes(connection));
app.use('/api', permisoRoutes(connection));
app.use('/api', moduloRoutes(connection));
app.use('/api', clienteRoutes(connection));

app.listen(port, () => {
  console.log(`Servidor ejecutandose en puerto: ${port}`);
});
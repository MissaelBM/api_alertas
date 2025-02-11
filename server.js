const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const userRoutes = require('./src/routes/usuario');
const rolRoutes = require('./src/routes/rol');
const empresaRoutes = require('./src/routes/empresa');
const promocionRoutes = require('./src/routes/empresa');
const notificacionRoutes = require('./src/routes/notificacion');
const guardadoRoutes = require('./src/routes/guardado');
const categoriaRoutes = require('./src/routes/categoria');
const metododepagoRoutes = require('./src/routes/metododepago');

const app = express();
const port = 3000;


app.use(bodyParser.json());


const connection = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: 'Fidel12-',
    database: 'alertas'
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar MySQL:', err);
    return;
  }
  console.log('Conectado');
});


app.use('/api', userRoutes(connection));
app.use('/api', rolRoutes(connection));
app.use('/api', empresaRoutes(connection));
app.use('/api', promocionRoutes(connection));
app.use('/api', notificacionRoutes(connection));
app.use('/api', guardadoRoutes(connection));
app.use('/api', categoriaRoutes(connection));
app.use('/api', metododepagoRoutes(connection));

app.listen(port, () => {
  console.log(`Servidor ejecutandose en puerto: ${port}`);
});
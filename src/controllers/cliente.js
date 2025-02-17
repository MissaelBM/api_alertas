module.exports = (connection) => {
  return {
    // Obtener todos los clientes
    getClientes: (req, res) => {
      connection.query('SELECT * FROM cliente', (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Error al obtener los clientes' });
        }
        res.status(200).json(results);
      });
    },

    // Obtener cliente por ID
    getClienteById: (req, res) => {
      const { id } = req.params;
      connection.query(
        'SELECT * FROM cliente WHERE idcliente = ?',
        [id],
        (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al obtener el cliente' });
          }
          if (results.length === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
          }
          res.status(200).json(results[0]);
        }
      );
    },

    // Crear un nuevo cliente
    createCliente: (req, res) => {
      const {
        usuario_idusuario, 
        nombre, 
        telefono, 
        ubicacion, 
        eliminado } = req.body;
      connection.query(
        'INSERT INTO cliente (usuario_idusuario, nombre, telefono, ubicacion, eliminado) VALUES (?, ?, ?, POINT(?, ?), ?)',
        [usuario_idusuario, nombre, telefono, ubicacion?.x, ubicacion?.y, eliminado || 0],
        (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al crear el cliente' });
          }
          res.status(201).json({ message: 'Cliente creado con éxito', clienteId: results.insertId });
        }
      );
    },

    // Actualizar un cliente por ID
    updateCliente: (req, res) => {
      const { id } = req.params;
      const { nombre, telefono, ubicacion, eliminado } = req.body;
      connection.query(
        'UPDATE cliente SET nombre = ?, telefono = ?, ubicacion = POINT(?, ?), eliminado = ? WHERE idcliente = ?',
        [nombre, telefono, ubicacion?.x, ubicacion?.y, eliminado, id],
        (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al actualizar el cliente' });
          }
          if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
          }
          res.status(200).json({ message: 'Cliente actualizado con éxito' });
        }
      );
    },

    // Eliminar un cliente por ID
    deleteCliente: (req, res) => {
      const { id } = req.params;
      connection.query(
        'DELETE FROM cliente WHERE idcliente = ?',
        [id],
        (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al eliminar el cliente' });
          }
          if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
          }
          res.status(200).json({ message: 'Cliente eliminado con éxito' });
        }
      );
    },
  };
};

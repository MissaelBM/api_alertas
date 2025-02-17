module.exports = (connection) => {
  return {
    // Obtener todos los clientes
    obtenerClientes: (req, res) => {
      connection.query('SELECT * FROM cliente', (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Error al obtener los clientes' });
        }
        res.status(200).json(results);
      });
    },

    // Obtener cliente por ID
    obtenerClientePorId: (req, res) => {
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
    crearCliente: (req, res) => {
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
    actualizarClientePorId: async (req, res) => {
      const { id } = req.params;
      const {nombre, telefono, ubicacion, eliminado} = req.body;

      try {
        let query = 'UPDATE cliente SET ';
        const updates = [];
        const params = [];

        if (nombre) {
          updates.push('nombre = ?');
          params.push(nombre);
        }

        if (telefono) {
          updates.push('telefono = ?');
          params.push(telefono);
        }

        if (ubicacion) {
          updates.push('ubicacion = ?');
          params.push(ubicacion);
        }

        if (updates.length === 0) {
          return res.status(400).json({ message: 'Sin información' });
        }

        query += updates.join(', ') + ' WHERE idcliente = ?';
        params.push(id);

        const [result] = await connection.promise().query(query, params);

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Cliente no econtrado' });
        }

        res.status(200).json({ message: 'Cliente actualizado exitosamente' });
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error' });
      }
    },

    // Eliminar un cliente por ID
    eliminarClientePorId: (req, res) => {
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

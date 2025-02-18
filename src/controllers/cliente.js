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
    crearCliente: async (req, res) => {
      const {usuario_idusuario, nombre, telefono, ubicacion, eliminado } = req.body;

      try {     
        const [result] = await connection.promise().query(
          'INSERT INTO cliente (usuario_idusuario, nombre, telefono, ubicacion, eliminado) VALUES (?, ?, ?, ST_GeomFromText(?), ?)',
          [usuario_idusuario, nombre, telefono, ubicacion, eliminado]
        );

        res.status(201).json({ message: 'Cliente registrado', clienteId: results.insertId });
      } catch (error) {
        console.error('Error al registrar cliente:', error);
        res.status(500).json({ message: 'Error al registrar cliente' });
      }
    },
    
    // Actualizar un cliente por ID
    actualizarClientePorId: async (req, res) => {
      const { id } = req.params;
      const {nombre, telefono, ubicacion} = req.body;

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
    eliminarClientePorId: async (req, res) => {
      const { id } = req.params;

      try {

        const [result] = await connection.promise().query(
          'UPDATE cliente SET eliminado = ? WHERE idcliente = ?',
          [1, id]
        );

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Cliente no encontrada' });
        }

        res.status(200).json({ message: 'Cliente eliminado lógicamente' });
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error' });
      }
    }
  };
};

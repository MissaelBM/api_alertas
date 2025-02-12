module.exports = (connection) => {
  return {
      consultar: async (req, res) => {
          try {
              // Solo selecciona notificaciones no eliminadas
              const [rows] = await connection.promise().query('SELECT * FROM notificacion WHERE eliminado = ?', [false]);
              res.status(200).json(rows);
          } catch (error) {
              console.error('Error:', error);
              res.status(500).json({ message: 'Error' });
          }
      },

      consultarId: async (req, res) => {
          const { id } = req.params;

          try {
              // Solo selecciona la notificación si no está eliminada
              const [rows] = await connection.promise().query('SELECT * FROM notificacion WHERE idnotificacion = ? AND eliminado = ?', [id, false]);

              if (rows.length === 0) {
                  return res.status(404).json({ message: 'Notificación no encontrada' });
              }

              res.status(200).json(rows[0]);
          } catch (error) {
              console.error('Error:', error);
              res.status(500).json({ message: 'Error' });
          }
      },

      notificacion: async (req, res) => {
          const { cliente_idcliente, promocion_idpromocion, fechayhora, leido } = req.body;

          try {
              // Inserta la notificación con `eliminado` en `false`
              const [result] = await connection.promise().query(
                  'INSERT INTO notificacion (cliente_idcliente, promocion_idpromocion, fechayhora, leido, eliminado) VALUES (?, ?, ?, ?, ?)',
                  [cliente_idcliente, promocion_idpromocion, fechayhora, leido, false]
              );

              res.status(201).json({ message: 'Notificación registrada', notificacionId: result.insertId });
          } catch (error) {
              console.error('Error al registrar notificación:', error);
              res.status(500).json({ message: 'Error al registrar notificación' });
          }
      },

      actualizarNotificacion: async (req, res) => {
          const { id } = req.params;
          const { cliente_idcliente, promocion_idpromocion, fechayhora, leido } = req.body;

          try {
              let query = 'UPDATE notificacion SET ';
              const updates = [];
              const params = [];

              if (cliente_idcliente !== undefined) {
                  updates.push('cliente_idcliente = ?');
                  params.push(cliente_idcliente);
              }

              if (promocion_idpromocion !== undefined) {
                  updates.push('promocion_idpromocion = ?');
                  params.push(promocion_idpromocion);
              }

              if (fechayhora !== undefined) {
                  updates.push('fechayhora = ?');
                  params.push(fechayhora);
              }

              if (leido !== undefined) {
                  updates.push('leido = ?');
                  params.push(leido);
              }

              if (updates.length === 0) {
                  return res.status(400).json({ message: 'Sin información' });
              }

              query += updates.join(', ') + ' WHERE idnotificacion = ?';
              params.push(id);

              const [result] = await connection.promise().query(query, params);

              if (result.affectedRows === 0) {
                  return res.status(404).json({ message: 'Notificación no encontrada' });
              }

              res.status(200).json({ message: 'Notificación actualizada exitosamente' });
          } catch (error) {
              console.error('Error:', error);
              res.status(500).json({ message: 'Error' });
          }
      },

      eliminarNotificacion: async (req, res) => {
          const { id } = req.params;

          try {
              // Marca la notificación como eliminada
              const [result] = await connection.promise().query(
                  'UPDATE notificacion SET eliminado = ? WHERE idnotificacion = ?',
                  [true, id]
              );

              if (result.affectedRows === 0) {
                  return res.status(404).json({ message: 'Notificación no encontrada' });
              }

              res.status(200).json({ message: 'Notificación eliminada lógicamente' });
          } catch (error) {
              console.error('Error:', error);
              res.status(500).json({ message: 'Error' });
          }
      }
  };
};
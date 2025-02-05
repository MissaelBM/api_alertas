module.exports = (connection) => {
    return {
        consultar: async (req, res) => {
            try {
              const [rows] = await connection.promise().query('SELECT * FROM notificacion');
              res.status(200).json(rows);
            } catch (error) {
              console.error('Error:', error);
              res.status(500).json({ message: 'Error' });
            }
      
          },
      
          consultarId: async (req, res) => {
            const { id } = req.params;
      
            try {
              const [rows] = await connection.promise().query('SELECT * FROM empresa WHERE idnotificacion = ?', [id]);
      
              if (rows.length === 0) {
                return res.status(404).json({ message: 'Notificacion no encontrada' });
              }
      
              res.status(200).json(rows[0]);
            } catch (error) {
              console.error('Error:', error);
              res.status(500).json({ message: 'Error' });
            }
          },
          empresa: async (req, res) => {
            const { nombre } = req.body;
      
            try {
      
              const [result] = await connection.promise().query(
                'INSERT INTO notificacion (cliente_idcliente, promocion_idpromocion, fechayhora, leido) VALUES (?, ?, ?, ?)',
                [nombre]
              );
      
              res.status(201).json({ message: 'Notificación registrada', rolId: result.insertId });
            } catch (error) {
              console.error('Error al registrar notificación:', error);
              res.status(500).json({ message: 'Error al registrar notificación' });
            }
          },  actualizarNotificacion: async (req, res) => {
            const { id } = req.params;
            const {cliente_idcliente , promocion_idpromocion, fechayhora, leido } = req.body;
      
            try {
              let query = 'UPDATE notificacion SET ';
              const updates = [];
              const params = [];
      
              if (cliente_idcliente ) {
                updates.push('cliente_idcliente = ?');
                params.push(cliente_idcliente);
              }
      
              if (promocion_idpromocion) {
                updates.push('promocion_idpromocion = ?');
                params.push(promocion_idpromocion);
              }
      
              if (fechayhora) {
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
                return res.status(404).json({ message: 'notificacion no econtrada' });
              }
      
              res.status(200).json({ message: 'notificacion actualizada exitosamente' });
            } catch (error) {
              console.error('Error:', error);
              res.status(500).json({ message: 'Error' });
            }
          }
    };
};
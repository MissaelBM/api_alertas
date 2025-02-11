

module.exports = (connection) => {
    return {
        consultar: async (req, res) => {
            try {
                const [rows] = await connection.promise().query('SELECT * FROM tarjeta');
                res.status(200).json(rows);
            } catch (error) {
                console.error('Error:', error);
                res.status(500).json({ message: 'Error' });
            }

        },
        consultarId: async (req, res) => {
            const { id } = req.params;
      
            try {
              const [rows] = await connection.promise().query('SELECT * FROM tarjeta WHERE idtarjeta = ?', [id]);
      
              if (rows.length === 0) {
                return res.status(404).json({ message: 'Tarjeta no encontrada' });
              }
      
              res.status(200).json(rows[0]);
            } catch (error) {
              console.error('Error:', error);
              res.status(500).json({ message: 'Error' });
            }
          },
         tarjeta: async (req, res) => {
            const { nombre } = req.body;
      
            try {
      
              const [result] = await connection.promise().query(
                'INSERT INTO tarjeta (metododepago_idmetododepago, numero, nombrecliente, fechaexpiracion, cvv, eliminado) VALUES (?, ?, ?, ?, ?, ?)',
                [nombre]
              );
      
              res.status(201).json({ message: 'Tarjeta registrada', promId: result.insertId });
            } catch (error) {
              console.error('Error al registrar tarjeta:', error);
              res.status(500).json({ message: 'Error al registrar tarjeta' });
            }
          },
          actualizarTarjeta: async (req, res) => {
            const { id } = req.params;
            const { metododepago_idmetododepago, numero, nombrecliente, fechaexpiracion, cvv, eliminado  } = req.body;
      
            try {
              let query = 'UPDATE tarjeta SET ';
              const updates = [];
              const params = [];
      
              if (metododepago_idmetododepago) {
                updates.push('metododepago_idmetododepago = ?');
                params.push(metododepago_idmetododepago);
              }
      
              if (numero) {
                updates.push('numero = ?');
                params.push(numero);
              }
      
              if (nombrecliente) {
                updates.push('nombrecliente = ?');
                params.push(nombrecliente);
              }
      
              if (fechaexpiracion) {
                updates.push('fechaexpiracion = ?');
                params.push(fechaexpiracion);
              }
              if (cvv) {
                updates.push('cvv = ?');
                params.push(cvv);
              }

              if (eliminado !== undefined) {
                updates.push('eliminado = ?');
                params.push(eliminado);
              }
      
              if (updates.length === 0) {
                return res.status(400).json({ message: 'Sin información' });
              }
      
              query += updates.join(', ') + ' WHERE idpromocion = ?';
              params.push(id);
      
              const [result] = await connection.promise().query(query, params);
      
              if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Promoción no econtrada' });
              }
      
              res.status(200).json({ message: 'Promoción actualizada exitosamente' });
            } catch (error) {
              console.error('Error:', error);
              res.status(500).json({ message: 'Error' });
            }
          }
    }
    
}
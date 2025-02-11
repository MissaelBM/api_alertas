module.exports = (connection) => {
  return {
      consultar: async (req, res) => {
          try {
              
              const [rows] = await connection.promise().query('SELECT * FROM tarjeta WHERE eliminado = ?', [false]);
              res.status(200).json(rows);
          } catch (error) {
              console.error('Error:', error);
              res.status(500).json({ message: 'Error' });
          }
      },

      consultarId: async (req, res) => {
          const { id } = req.params;

          try {
              
              const [rows] = await connection.promise().query('SELECT * FROM tarjeta WHERE idtarjeta = ? AND eliminado = ?', [id, false]);

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
          const { metododepago_idmetododepago, numero, nombrecliente, fechaexpiracion, cvv } = req.body;

          try {
              
              const [result] = await connection.promise().query(
                  'INSERT INTO tarjeta (metododepago_idmetododepago, numero, nombrecliente, fechaexpiracion, cvv, eliminado) VALUES (?, ?, ?, ?, ?, ?)',
                  [metododepago_idmetododepago, numero, nombrecliente, fechaexpiracion, cvv, false]
              );

              res.status(201).json({ message: 'Tarjeta registrada', tarjetaId: result.insertId });
          } catch (error) {
              console.error('Error al registrar tarjeta:', error);
              res.status(500).json({ message: 'Error al registrar tarjeta' });
          }
      },

      actualizarTarjeta: async (req, res) => {
          const { id } = req.params;
          const { metododepago_idmetododepago, numero, nombrecliente, fechaexpiracion, cvv, eliminado } = req.body;

          try {
              let query = 'UPDATE tarjeta SET ';
              const updates = [];
              const params = [];

              if (metododepago_idmetododepago !== undefined) {
                  updates.push('metododepago_idmetododepago = ?');
                  params.push(metododepago_idmetododepago);
              }

              if (numero !== undefined) {
                  updates.push('numero = ?');
                  params.push(numero);
              }

              if (nombrecliente !== undefined) {
                  updates.push('nombrecliente = ?');
                  params.push(nombrecliente);
              }

              if (fechaexpiracion !== undefined) {
                  updates.push('fechaexpiracion = ?');
                  params.push(fechaexpiracion);
              }

              if (cvv !== undefined) {
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

              query += updates.join(', ') + ' WHERE idtarjeta = ?';
              params.push(id);

              const [result] = await connection.promise().query(query, params);

              if (result.affectedRows === 0) {
                  return res.status(404).json({ message: 'Tarjeta no encontrada' });
              }

              res.status(200).json({ message: 'Tarjeta actualizada exitosamente' });
          } catch (error) {
              console.error('Error:', error);
              res.status(500).json({ message: 'Error' });
          }
      },

      eliminarTarjeta: async (req, res) => {
          const { id } = req.params;

          try {
              
              const [result] = await connection.promise().query(
                  'UPDATE tarjeta SET eliminado = ? WHERE idtarjeta = ?',
                  [true, id]
              );

              if (result.affectedRows === 0) {
                  return res.status(404).json({ message: 'Tarjeta no encontrada' });
              }

              res.status(200).json({ message: 'Tarjeta eliminada lógicamente' });
          } catch (error) {
              console.error('Error:', error);
              res.status(500).json({ message: 'Error' });
          }
      }
  };
};
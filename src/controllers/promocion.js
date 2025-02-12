module.exports = (connection) => {
  return {
      consultar: async (req, res) => {
          try {
              // Solo selecciona promociones no eliminadas
              const [rows] = await connection.promise().query('SELECT * FROM promocion WHERE eliminado = ?', [false]);
              res.status(200).json(rows);
          } catch (error) {
              console.error('Error:', error);
              res.status(500).json({ message: 'Error' });
          }
      },

      consultarId: async (req, res) => {
          const { id } = req.params;

          try {
              // Solo selecciona la promoción si no está eliminada
              const [rows] = await connection.promise().query('SELECT * FROM promocion WHERE idpromocion = ? AND eliminado = ?', [id, false]);

              if (rows.length === 0) {
                  return res.status(404).json({ message: 'Promoción no encontrada' });
              }

              res.status(200).json(rows[0]);
          } catch (error) {
              console.error('Error:', error);
              res.status(500).json({ message: 'Error' });
          }
      },

      promocion: async (req, res) => {
          const { empresa_idempresa, nombre, descripcion, precio, vigenciainicio, vigenciafin, tipo } = req.body;

          try {
              // Inserta la promoción con `eliminado` en `false`
              const [result] = await connection.promise().query(
                  'INSERT INTO promocion (empresa_idempresa, nombre, descripcion, precio, vigenciainicio, vigenciafin, tipo, eliminado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                  [empresa_idempresa, nombre, descripcion, precio, vigenciainicio, vigenciafin, tipo, false]
              );

              res.status(201).json({ message: 'Promoción registrada', promId: result.insertId });
          } catch (error) {
              console.error('Error al registrar promoción:', error);
              res.status(500).json({ message: 'Error al registrar promoción' });
          }
      },

      actualizarPromocion: async (req, res) => {
          const { id } = req.params;
          const { empresa_idempresa, nombre, descripcion, precio, vigenciainicio, vigenciafin, tipo } = req.body;

          try {
              let query = 'UPDATE promocion SET ';
              const updates = [];
              const params = [];

              if (empresa_idempresa !== undefined) {
                  updates.push('empresa_idempresa = ?');
                  params.push(empresa_idempresa);
              }

              if (nombre !== undefined) {
                  updates.push('nombre = ?');
                  params.push(nombre);
              }

              if (descripcion !== undefined) {
                  updates.push('descripcion = ?');
                  params.push(descripcion);
              }

              if (precio !== undefined) {
                  updates.push('precio = ?');
                  params.push(precio);
              }

              if (vigenciainicio !== undefined) {
                  updates.push('vigenciainicio = ?');
                  params.push(vigenciainicio);
              }

              if (vigenciafin !== undefined) {
                  updates.push('vigenciafin = ?');
                  params.push(vigenciafin);
              }

              if (tipo !== undefined) {
                  updates.push('tipo = ?');
                  params.push(tipo);
              }

              if (updates.length === 0) {
                  return res.status(400).json({ message: 'Sin información' });
              }

              query += updates.join(', ') + ' WHERE idpromocion = ?';
              params.push(id);

              const [result] = await connection.promise().query(query, params);

              if (result.affectedRows === 0) {
                  return res.status(404).json({ message: 'Promoción no encontrada' });
              }

              res.status(200).json({ message: 'Promoción actualizada exitosamente' });
          } catch (error) {
              console.error('Error:', error);
              res.status(500).json({ message: 'Error' });
          }
      },

      eliminarPromocion: async (req, res) => {
          const { id } = req.params;

          try {
              // Marca la promoción como eliminada
              const [result] = await connection.promise().query(
                  'UPDATE promocion SET eliminado = ? WHERE idpromocion = ?',
                  [true, id]
              );

              if (result.affectedRows === 0) {
                  return res.status(404).json({ message: 'Promoción no encontrada' });
              }

              res.status(200).json({ message: 'Promoción eliminada lógicamente' });
          } catch (error) {
              console.error('Error:', error);
              res.status(500).json({ message: 'Error' });
          }
      }
  };
};
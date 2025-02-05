
module.exports = (connection) => {
    return {
        consultar: async (req, res) => {
            try {
                const [rows] = await connection.promise().query('SELECT * FROM promocion');
                res.status(200).json(rows);
            } catch (error) {
                console.error('Error:', error);
                res.status(500).json({ message: 'Error' });
            }

        },
        consultarId: async (req, res) => {
            const { id } = req.params;
      
            try {
              const [rows] = await connection.promise().query('SELECT * FROM promocion WHERE idpromocion = ?', [id]);
      
              if (rows.length === 0) {
                return res.status(404).json({ message: 'Promocion no encontrada' });
              }
      
              res.status(200).json(rows[0]);
            } catch (error) {
              console.error('Error:', error);
              res.status(500).json({ message: 'Error' });
            }
          },
          promocion: async (req, res) => {
            const { nombre } = req.body;
      
            try {
      
              const [result] = await connection.promise().query(
                'INSERT INTO promocion (empresa_idempresa, nombre, descripcion, precio, vigenciainicio, vigenciafin, tipo) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [nombre]
              );
      
              res.status(201).json({ message: 'Promocion registrada', promId: result.insertId });
            } catch (error) {
              console.error('Error al registrar promocion:', error);
              res.status(500).json({ message: 'Error al registrar promocion' });
            }
          },
          actualizarPromocion: async (req, res) => {
            const { id } = req.params;
            const { empresa_idempresa, nombre, descripcion, precio  } = req.body;
      
            try {
              let query = 'UPDATE promocion SET ';
              const updates = [];
              const params = [];
      
              if (empresa_idempresa) {
                updates.push('empresa_idempresa = ?');
                params.push(empresa_idempresa);
              }
      
              if (nombre) {
                updates.push('nombre = ?');
                params.push(nombre);
              }
      
              if (descripcion) {
                updates.push('descripcion = ?');
                params.push(descripcion);
              }
      
              if (precio) {
                updates.push('precio = ?');
                params.push(precio);
              }
              if (vigenciainicio) {
                updates.push('vigenciainicio = ?');
                params.push(vigenciainicio);
              }
              if (vigenciafin) {
                updates.push('vigenciafin = ?');
                params.push(precio);
              }
              if (tipo) {
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
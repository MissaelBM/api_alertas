

module.exports = (connection) => {
    return {
        consultar: async (req, res) => {
            try {
                const [rows] = await connection.promise().query('SELECT * FROM empresa');
                res.status(200).json(rows);
            } catch (error) {
                console.error('Error:', error);
                res.status(500).json({ message: 'Error' });
            }

        },

        consultarId: async (req, res) => {
          const { id } = req.params;
    
          try {
            const [rows] = await connection.promise().query('SELECT * FROM empresa WHERE idempresa = ?', [id]);
    
            if (rows.length === 0) {
              return res.status(404).json({ message: 'Empresa no encontrada' });
            }
    
            res.status(200).json(rows[0]);
          } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Error' });
          }
        },
        empresa: async (req, res) => {
              const {nombre} = req.body;
        
              try {
              
                const [result] = await connection.promise().query(
                  'INSERT INTO empresa (usuario_idusuario, nombre, descripcion, ubicacion) VALUES (?, ?, ?, ?)',
                  [nombre]
                );
        
                res.status(201).json({ message: 'Empresa registrado', rolId: result.insertId });
              } catch (error) {
                console.error('Error al registrar empresa:', error);
                res.status(500).json({ message: 'Error al registrar empresa' });
              }
            },
                actualizarEmpresa: async (req, res) => {
                  const { id } = req.params;
                  const { rol_idrol, email, contraseña, estado } = req.body;
            
                  try {
                    let query = 'UPDATE empresa SET ';
                    const updates = [];
                    const params = [];
            
                    if (rol_idrol) {
                      updates.push('usuario_idusuario = ?');
                      params.push(rol_idrol);
                    }
            
                    if (email) {
                      updates.push('nombre = ?');
                      params.push(email);
                    }
            
                    if (contraseña) {
                        updates.push('descripcion = ?');
                        params.push(email);
                    }
            
                    if (estado !== undefined) {
                      updates.push('ubicacion = ?');
                      params.push(estado);
                    }
            
                    if (updates.length === 0) {
                      return res.status(400).json({ message: 'Sin información' });
                    }
            
                    query += updates.join(', ') + ' WHERE idempresa = ?';
                    params.push(id);
            
                    const [result] = await connection.promise().query(query, params);
            
                    if (result.affectedRows === 0) {
                      return res.status(404).json({ message: 'Empresa no econtrada' });
                    }
            
                    res.status(200).json({ message: 'Empresa actualizada exitosamente' });
                  } catch (error) {
                    console.error('Error:', error);
                    res.status(500).json({ message: 'Error' });
                  }
                }
    };

};
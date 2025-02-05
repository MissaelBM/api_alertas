module.exports = (connection)=>{
  return{
    consultar: async (req, res) => {
        try {
          const [rows] = await connection.promise().query('SELECT * FROM rol');
          res.status(200).json(rows);
        } catch (error) {
          console.error('Error:', error);
          res.status(500).json({ message: 'Error' });
        }
      },
      rol: async (req, res) => {
            const {nombre} = req.body;
      
            try {
            
              const [result] = await connection.promise().query(
                'INSERT INTO rol (nombre) VALUES (?)',
                [nombre]
              );
      
              res.status(201).json({ message: 'Rol registrado', rolId: result.insertId });
            } catch (error) {
              console.error('Error al registrar rol:', error);
              res.status(500).json({ message: 'Error al registrar rol' });
            }
          },

    
          consultarId: async (req, res) => {
            const { id } = req.params;
      
            try {
              const [rows] = await connection.promise().query('SELECT * FROM rol WHERE idrol = ?', [id]);
      
              if (rows.length === 0) {
                return res.status(404).json({ message: 'Usuario no encontrado' });
              }
      
              res.status(200).json(rows[0]);
            } catch (error) {
              console.error('Error:', error);
              res.status(500).json({ message: 'Error' });
            }
          },
           actualizarRol: async (req, res) => {
                const { id } = req.params;
                const { nombre } = req.body;
          
                try {
                  let query = 'UPDATE rol SET ';
                  const updates = [];
                  const params = [];
          
                  if (nombre) {
                    updates.push('nombre = ?');
                    params.push(nombre);
                  }
          
                
          
                  if (updates.length === 0) {
                    return res.status(400).json({ message: 'Sin información' });
                  }
          
                  query += updates.join(', ') + ' WHERE idrol = ?';
                  params.push(id);
          
                  const [result] = await connection.promise().query(query, params);
          
                  if (result.affectedRows === 0) {
                    return res.status(404).json({ message: 'Rol no econtrado' });
                  }
          
                  res.status(200).json({ message: 'Rol actualizado exitosamente' });
                } catch (error) {
                  console.error('Error:', error);
                  res.status(500).json({ message: 'Error' });
                }
              }
  };
};
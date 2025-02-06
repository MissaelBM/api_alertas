module.exports = (connection)=>{
    return{
      consultar: async (req, res) => {
          try {
            const [rows] = await connection.promise().query('SELECT * FROM categoria');
            res.status(200).json(rows);
          } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Error' });
          }
        },
        categoria: async (req, res) => {
              const {nombre} = req.body;
        
              try {
              
                const [result] = await connection.promise().query(
                  'INSERT INTO categoria (nombre) VALUES (?)',
                  [nombre]
                );
        
                res.status(201).json({ message: 'Categoria registrada', rolId: result.insertId });
              } catch (error) {
                console.error('Error al registrar categoria:', error);
                res.status(500).json({ message: 'Error al registrar categoria' });
              }
            },
  
      
            consultarId: async (req, res) => {
              const { id } = req.params;
        
              try {
                const [rows] = await connection.promise().query('SELECT * FROM categoria WHERE idcategoria = ?', [id]);
        
                if (rows.length === 0) {
                  return res.status(404).json({ message: 'Categoria no encontrada' });
                }
        
                res.status(200).json(rows[0]);
              } catch (error) {
                console.error('Error:', error);
                res.status(500).json({ message: 'Error' });
              }
            },
             actualizarCategoria: async (req, res) => {
                  const { id } = req.params;
                  const { nombre } = req.body;
            
                  try {
                    let query = 'UPDATE categoria SET ';
                    const updates = [];
                    const params = [];
            
                    if (nombre) {
                      updates.push('nombre = ?');
                      params.push(nombre);
                    }
            
                  
            
                    if (updates.length === 0) {
                      return res.status(400).json({ message: 'Sin información' });
                    }
            
                    query += updates.join(', ') + ' WHERE idcategoria = ?';
                    params.push(id);
            
                    const [result] = await connection.promise().query(query, params);
            
                    if (result.affectedRows === 0) {
                      return res.status(404).json({ message: 'Categoria no econtrado' });
                    }
            
                    res.status(200).json({ message: 'Categoria actualizada exitosamente' });
                  } catch (error) {
                    console.error('Error:', error);
                    res.status(500).json({ message: 'Error' });
                  }
                }
    };
  };
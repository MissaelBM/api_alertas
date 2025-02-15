module.exports = (connection) => {
    return {
        consultar: async (req, res) => {
            try {
              const [rows] = await connection.promise().query('SELECT * FROM listadecategoria WHERE eliminado = ?', [0]);
              res.status(200).json(rows);
            } catch (error) {
              console.error('Error:', error);
              res.status(500).json({ message: 'Error' });
            }
      
          },
          consultarId: async (req, res) => {
            const { idlistadecategoria } = req.params;
      
            try {
              const [rows] = await connection.promise().query('SELECT * FROM listadecategoria WHERE idlistadecategoria = ? AND eliminado = ?', [idlistadecategoria, 0]);
      
              if (rows.length === 0) {
                return res.status(404).json({ message: 'Lista de categoria no encontrada' });
              }
      
              res.status(200).json(rows[0]);
            } catch (error) {
              console.error('Error:', error);
              res.status(500).json({ message: 'Error' });
            }
          },
          listadecategoria: async (req, res) => {
            const {cliente_idcliente, categoria_idcategoria } = req.body;
      
            try {
      
              const [result] = await connection.promise().query(
                'INSERT INTO listadecategoria (cliente_idcliente, categoria_idcategoria, eliminado) VALUES (?, ?, ?)',
                [cliente_idcliente, categoria_idcategoria, 0]
              );
      
              res.status(201).json({ message: 'Lista de categoria registrada', guardadoId: result.insertId });
            } catch (error) {
              console.error('Error al registrar lista de categoria:', error);
              res.status(500).json({ message: 'Error al registrar Lista de categoria' });
            }
          },
          actualizarListadecategoria: async (req, res) => {
            const { idlistadecategoria } = req.params;
            const {cliente_idcliente, categoria_idcategoria} = req.body;
      
            try {
              let query = 'UPDATE listadecategoria SET ';
              const updates = [];
              const params = [];
      
             
              if (cliente_idcliente) {
                updates.push('cliente_idcliente = ?');
                params.push(cliente_idcliente);
              }
      
              if (categoria_idcategoria) {
                updates.push('categoria_idcategoria = ?');
                params.push(categoria_idcategoria);
              }
      
             
              if (updates.length === 0) {
                return res.status(400).json({ message: 'Sin información' });
              }
      
              query += updates.join(', ') + ' WHERE idlistadecategoria  = ?';
              params.push(idlistadecategoria );
      
              const [result] = await connection.promise().query(query, params);
      
              if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Listadecategoria  no econtrada' });
              }
      
              res.status(200).json({ message: 'Listadecategoria  actualizada exitosamente' });
            } catch (error) {
              console.error('Error:', error);
              res.status(500).json({ message: 'Error' });
            }
          },

          eliminarListadecategoria : async (req, res) => {
              const { idlistadecategoria } = req.params;
    
              try {
                  
                  const [result] = await connection.promise().query(
                      'UPDATE listadecategoria SET eliminado = ? WHERE idlistadecategoria = ?',
                      [1, idlistadecategoria]
                  );
    
                  if (result.affectedRows === 0) {
                      return res.status(404).json({ message: 'listadecategoria no encontrada' });
                  }
    
                  res.status(200).json({ message: 'listadecategoria eliminada' });
              } catch (error) {
                  console.error('Error:', error);
                  res.status(500).json({ message: 'Error' });
              }
          }

    };
};
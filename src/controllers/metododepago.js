module.exports = (connection) => {
    return {
      consultar: async (req, res) => {
        try {
          const [rows] = await connection.promise().query('SELECT * FROM metododepago WHERE eliminado = ?', [false]);
          res.status(200).json(rows);
        } catch (error) {
          console.error('Error:', error);
          res.status(500).json({ message: 'Error' });
        }
  
      },
  
      consultarId: async (req, res) => {
        const { idmetodopago } = req.params;
  
        try {
          const [rows] = await connection.promise().query('SELECT * FROM metododepago WHERE idmetododepago = ? AND eliminado = ?', [idmetodopago,false]);
  
          if (rows.length === 0) {
            return res.status(404).json({ message: 'Método de pago no encontrada' });
          }
  
          res.status(200).json(rows[0]);
        } catch (error) {
          console.error('Error:', error);
          res.status(500).json({ message: 'Error' });
        }
      },
      metododepago: async (req, res) => {
        const { cliente_idcliente, tipo} = req.body;
  
        try {
  
          const [result] = await connection.promise().query(
            'INSERT INTO metododepago (cliente_idcliente, tipo, eliminado) VALUES (?, ?, ?)',
            [cliente_idcliente, tipo, false]
          );
  
          res.status(201).json({ message: 'Método de pago registrado', metodoId: result.insertId });
        } catch (error) {
          console.error('Error al registrar método de pago:', error);
          res.status(500).json({ message: 'Error al registrar método de pago' });
        }
      },
      actualizarMetododepago: async (req, res) => {
        const { idmetodopago } = req.params;
        const {cliente_idcliente , tipo, eliminado } = req.body;
  
        try {
          let query = 'UPDATE metododepago SET ';
          const updates = [];
          const params = [];
  
          if (cliente_idcliente ) {
            updates.push('cliente_idcliente = ?');
            params.push(cliente_idcliente);
          }
  
          if (tipo) {
            updates.push('tipo = ?');
            params.push(tipo);
          }
  
         
          if (eliminado !== undefined) {
            updates.push('eliminado = ?');
            params.push(eliminado);
          }
  
          if (updates.length === 0) {
            return res.status(400).json({ message: 'Sin información' });
          }
  
          query += updates.join(', ') + ' WHERE idmetododepago = ?';
          params.push(idmetodopago);
  
          const [result] = await connection.promise().query(query, params);
  
          if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Método de pago no econtrada' });
          }
  
          res.status(200).json({ message: 'Método de pago actualizada exitosamente' });
        } catch (error) {
          console.error('Error:', error);
          res.status(500).json({ message: 'Error' });
        }
      },eliminarMetododepago: async (req, res) => {
        const { idguardado } = req.params;

        try {
            
            const [result] = await connection.promise().query(
                'UPDATE metododepago SET eliminado = ? WHERE idmetododepago = ?',
                [true, idguardado]
            );

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Metodo de pago no encontrada' });
            }

            res.status(200).json({ message: 'Metodo de pago eliminado lógicamente' });
        } catch (error) {
            console.error('Error:', error);
            res.status(500).json({ message: 'Error' });
        }
    }

    };
  
  };
module.exports = (connection) => {
    return {
        consultar: async (req, res) => {
            try {
               
                const [rows] = await connection.promise().query('SELECT * FROM movimiento WHERE eliminado = ?', [false]);
                res.status(200).json(rows);
            } catch (error) {
                console.error('Error:', error);
                res.status(500).json({ message: 'Error' });
            }
        },
  
        consultarId: async (req, res) => {
            const { id } = req.params;
  
            try {
                // Solo selecciona la notificación si no está eliminada
                const [rows] = await connection.promise().query('SELECT * FROM movimiento WHERE idmovimiento = ? AND eliminado = ?', [id, false]);
  
                if (rows.length === 0) {
                    return res.status(404).json({ message: 'Movimiento no encontrada' });
                }
  
                res.status(200).json(rows[0]);
            } catch (error) {
                console.error('Error:', error);
                res.status(500).json({ message: 'Error' });
            }
        },
  
        movimiento: async (req, res) => {
            const { cliente_idcliente, metododepago_idmetododepago, fechamovimiento, monto, iva, montototal } = req.body;
  
            try {
                
                const [result] = await connection.promise().query(
                    'INSERT INTO notificacion (cliente_idcliente, metododepago_idmetododepago, fechamovimiento, monto, iva, montototal, eliminado) VALUES (?, ?, ?, ?, ?,?,?)',
                    [cliente_idcliente, metododepago_idmetododepago, fechamovimiento, monto, iva, montototal, false]
                );
  
                res.status(201).json({ message: 'Movimiento registrado', movimientoId: result.insertId });
            } catch (error) {
                console.error('Error al registrar movimiento:', error);
                res.status(500).json({ message: 'Error al registrar movimiento' });
            }
        },
  
        actualizarMovimiento: async (req, res) => {
            const { idmovimiento } = req.params;
            const { cliente_idcliente, metododepago_idmetododepago, fechamovimiento, monto, iva, montototal } = req.body;
  
            try {
                let query = 'UPDATE notificacion SET ';
                const updates = [];
                const params = [];
  
                if (cliente_idcliente) {
                    updates.push('cliente_idcliente = ?');
                    params.push(cliente_idcliente);
                }
  
                if (metododepago_idmetododepago) {
                    updates.push('metododepago_idmetododepago = ?');
                    params.push(metododepago_idmetododepago);
                }
  
                if (fechamovimiento) {
                    updates.push('fechamovimiento = ?');
                    params.push(fechamovimiento);
                }
  
                if (monto) {
                    updates.push('monto = ?');
                    params.push(monto);
                }
                if (iva) {
                    updates.push('iva = ?');
                    params.push(iva);
                }
                if (montototal) {
                    updates.push('montototal = ?');
                    params.push(montototal);
                }
  
                if (updates.length === 0) {
                    return res.status(400).json({ message: 'Sin información' });
                }
  
                query += updates.join(', ') + ' WHERE idnotificacion = ?';
                params.push(idmovimiento);
  
                const [result] = await connection.promise().query(query, params);
  
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: 'Movimiento no encontrada' });
                }
  
                res.status(200).json({ message: 'Movimiento actualizado exitosamente' });
            } catch (error) {
                console.error('Error:', error);
                res.status(500).json({ message: 'Error' });
            }
        },
  
        eliminarMovimiento: async (req, res) => {
            const { id } = req.params;
  
            try {
                // Marca la notificación como eliminada
                const [result] = await connection.promise().query(
                    'UPDATE movimiento SET eliminado = ? WHERE idmovimiento = ?',
                    [true, id]
                );
  
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: 'Movimiento no encontrada' });
                }
  
                res.status(200).json({ message: 'Movimiento eliminado' });
            } catch (error) {
                console.error('Error:', error);
                res.status(500).json({ message: 'Error' });
            }
        }
    };
  };
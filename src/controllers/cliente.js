module.exports = (connection) => {
    return {
        consultar: async (req, res) => {
            try {
                
                const [rows] = await connection.promise().query('SELECT * FROM cliente WHERE eliminado = ?', [false]);
                res.status(200).json(rows);
            } catch (error) {
                console.error('Error:', error);
                res.status(500).json({ message: 'Error' });
            }
        },
  
        consultarId: async (req, res) => {
            const { idcliente } = req.params;
  
            try {
                
                const [rows] = await connection.promise().query('SELECT * FROM cliente WHERE idcliente = ? AND eliminado = ?', [idcliente, false]);
  
                if (rows.length === 0) {
                    return res.status(404).json({ message: 'Cliente no encontrado' });
                }
  
                res.status(200).json(rows[0]);
            } catch (error) {
                console.error('Error:', error);
                res.status(500).json({ message: 'Error' });
            }
        },
  
        cliente: async (req, res) => {
            const { usuario_idusuario, nombre, telefono, ubicacion } = req.body;
  
            try {
               
                const [result] = await connection.promise().query(
                    'INSERT INTO notificacion (usuario_idusuario, nombre, telefono, ubicacion, eliminado) VALUES (?, ?, ?, ?, ?)',
                    [usuario_idusuario, nombre, telefono, ubicacion, false]
                );
  
                res.status(201).json({ message: 'Notificación registrada', notificacionId: result.insertId });
            } catch (error) {
                console.error('Error al registrar notificación:', error);
                res.status(500).json({ message: 'Error al registrar notificación' });
            }
        },
  
        actualizarCliente: async (req, res) => {
            const { idcliente } = req.params;
            const { usuario_idusuario, nombre, telefono, ubicacion} = req.body;
  
            try {
                let query = 'UPDATE cliente SET ';
                const updates = [];
                const params = [];
  
                if (usuario_idusuario) {
                    updates.push('usuario_idusuario = ?');
                    params.push(usuario_idusuario);
                }
  
                if (nombre) {
                    updates.push('nombre = ?');
                    params.push(nombre);
                }
  
                if (telefono) {
                    updates.push('telefono = ?');
                    params.push(telefono);
                }
  
                if (ubicacion) {
                    updates.push('ubicacion = ?');
                    params.push(ubicacion);
                }
  
                if (updates.length === 0) {
                    return res.status(400).json({ message: 'Sin información' });
                }
  
                query += updates.join(', ') + ' WHERE idcliente = ?';
                params.push(idcliente);
  
                const [result] = await connection.promise().query(query, params);
  
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: 'Cliente no encontrado' });
                }
  
                res.status(200).json({ message: 'Cliente actualizado exitosamente' });
            } catch (error) {
                console.error('Error:', error);
                res.status(500).json({ message: 'Error' });
            }
        },
  
        eliminarCliente: async (req, res) => {
            const { idcliente } = req.params;
  
            try {
                
                const [result] = await connection.promise().query(
                    'UPDATE cliente SET eliminado = ? WHERE idcliente = ?',
                    [true, idcliente]
                );
  
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: 'Cliente no encontrado' });
                }
  
                res.status(200).json({ message: 'Cliente eliminado lógicamente' });
            } catch (error) {
                console.error('Error:', error);
                res.status(500).json({ message: 'Error' });
            }
        }
    };
  };
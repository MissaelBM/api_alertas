module.exports = (connection) => {
    return {
        consultar: async (req, res) => {
            try {
                // Solo selecciona promociones no eliminadas
                const [rows] = await connection.promise().query('SELECT * FROM permiso WHERE eliminado = ?', [false]);
                res.status(200).json(rows);
            } catch (error) {
                console.error('Error:', error);
                res.status(500).json({ message: 'Error' });
            }
        },
  
        consultarId: async (req, res) => {
            const { idpermiso } = req.params;
  
            try {
                // Solo selecciona la promoción si no está eliminada
                const [rows] = await connection.promise().query('SELECT * FROM permiso WHERE idpermiso = ? AND eliminado = ?', [idpermiso, false]);
  
                if (rows.length === 0) {
                    return res.status(404).json({ message: 'permiso no encontrada' });
                }
  
                res.status(200).json(rows[0]);
            } catch (error) {
                console.error('Error:', error);
                res.status(500).json({ message: 'Error' });
            }
        },
  
        permiso: async (req, res) => {
            const { nombre, idcreador, idactualizacion, fechacreacion, fechaactulizacion, eliminado} = req.body;
  
            try {
                
                const [result] = await connection.promise().query(
                    'INSERT INTO permiso ( nombre,  idcreador, idactualizacion, fechacreacion, fechaactulizacion, eliminado) VALUES (?, ?, ?, ?, ?, ?)',
                    [ nombre,  idcreador, idactualizacion, fechacreacion, fechaactulizacion, eliminado, false]
                );
  
                res.status(201).json({ message: 'Promoción registrada', promId: result.insertId });
            } catch (error) {
                console.error('Error al registrar promoción:', error);
                res.status(500).json({ message: 'Error al registrar promoción' });
            }
        },
  
        actualizarPromocion: async (req, res) => {
            const { idpermiso } = req.params;
            const { nombre,  idcreador, idactualizacion, fechacreacion, fechaactulizacion } = req.body;
  
            try {
                let query = 'UPDATE permiso SET ';
                const updates = [];
                const params = [];
  
                
  
                if (nombre) {
                    updates.push('nombre = ?');
                    params.push(nombre);
                }
  
                if (idcreador) {
                    updates.push('idcreador = ?');
                    params.push(idcreador);
                }
  
                if (idactualizacion) {
                    updates.push('idactualizacion = ?');
                    params.push(idactualizacion);
                }
  
                if (fechacreacion) {
                    updates.push('fechacreacion = ?');
                    params.push(fechacreacion);
                }
  
                if (fechaactulizacion) {
                    updates.push('fechaactulizacion = ?');
                    params.push(fechaactulizacion);
                }
  
  
                if (updates.length === 0) {
                    return res.status(400).json({ message: 'Sin información' });
                }
  
                query += updates.join(', ') + ' WHERE idpermiso = ?';
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
            const { idpermiso } = req.params;
  
            try {
                // Marca la promoción como eliminada
                const [result] = await connection.promise().query(
                    'UPDATE permiso SET eliminado = ? WHERE idpermiso = ?',
                    [true, idpermiso]
                );
  
                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: 'Permiso no encontrada' });
                }
  
                res.status(200).json({ message: 'Permiso eliminada lógicamente' });
            } catch (error) {
                console.error('Error:', error);
                res.status(500).json({ message: 'Error' });
            }
        }
    };
  };
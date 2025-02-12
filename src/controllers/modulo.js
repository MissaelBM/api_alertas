module.exports = (connection) => {
    return {
        consultar: async (req, res) => {
            try {
                const [rows] = await connection.promise().query('SELECT * FROM modulo WHERE eliminado = ?', [false]);
                res.status(200).json(rows);
            } catch (error) {
                console.error('Error:', error);
                res.status(500).json({ message: 'Error' });
            }
        },

        modulo: async (req, res) => {
            const { permiso_idpermiso, rol_idrol } = req.body;

            try {
                const [result] = await connection.promise().query(
                    'INSERT INTO modulo (permiso_idpermiso, rol_idrol, eliminado) VALUES (?, ?, ?)',
                    [permiso_idpermiso, rol_idrol, false]
                );

                res.status(201).json({ message: 'Rol registrado', permisoId: result.insertId });
            } catch (error) {
                console.error('Error al registrar permiso:', error);
                res.status(500).json({ message: 'Error al registrar permiso' });
            }
        },

        consultarId: async (req, res) => {
            const { idpermiso } = req.params;

            try {
                const [rows] = await connection.promise().query('SELECT * FROM permiso WHERE idpermiso = ? AND eliminado = ?', [idpermiso, false]);

                if (rows.length === 0) {
                    return res.status(404).json({ message: 'Permiso no encontrado' });
                }

                res.status(200).json(rows[0]);
            } catch (error) {
                console.error('Error:', error);
                res.status(500).json({ message: 'Error' });
            }
        },

        actualizarModulo: async (req, res) => {
            const { idpermiso } = req.params;
            const { permiso_idpermiso, rol_idrol } = req.body;

            try {
                let query = 'UPDATE permiso SET ';
                const updates = [];
                const params = [];

                if (permiso_idpermiso) {
                    updates.push('permiso_idpermiso = ?');
                    params.push( permiso_idpermiso);
                }

                if (updates.length === 0) {
                    return res.status(400).json({ message: 'Sin información' });
                }

                query += updates.join(', ') + ' WHERE idpermiso = ?';
                params.push(idpermiso);

                const [result] = await connection.promise().query(query, params);

                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: 'Permiso no encontrado' });
                }

                res.status(200).json({ message: 'Permiso actualizado exitosamente' });
            } catch (error) {
                console.error('Error:', error);
                res.status(500).json({ message: 'Error' });
            }
        },

        eliminarModulo: async (req, res) => {
            const { idpermiso } = req.params;

            try {
                const [result] = await connection.promise().query(
                    'UPDATE permiso SET eliminado = ? WHERE idpermiso = ?',
                    [true, idpermiso]
                );

                if (result.affectedRows === 0) {
                    return res.status(404).json({ message: 'Permiso no encontrado' });
                }

                res.status(200).json({ message: 'Permiso eliminado' });
            } catch (error) {
                console.error('Error:', error);
                res.status(500).json({ message: 'Error' });
            }
        }
    };
};
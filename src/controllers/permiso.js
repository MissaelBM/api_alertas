module.exports = (connection) => {
  return {
    // Obtener todos los permisos
    obtenerPermisos: (req, res) => {
      const query = 'SELECT * FROM permiso WHERE eliminado = 0';
      connection.query(query, (error, results) => {
        if (error) {
          res.status(500).json({ error: 'Error al obtener permisos' });
        } else {
          res.status(200).json(results);
        }
      });
    },

    // Obtener un permiso por ID
    obtenerPermisoPorId: async (req, res) => {
      const { id } = req.params;

      try {
        const [rows] = await connection.promise().query('SELECT * FROM permiso WHERE idpermiso = ? AND eliminado = ?', [id, 0]);

        if (rows.length === 0) {
          return res.status(404).json({ message: 'Permiso no encontrado' });
        }

        res.status(200).json(rows[0]);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error' });
      }
    },


    // Crear un nuevo permiso
    crearPermiso: (req, res) => {
      const {nombre, idcreador, idactualizacion, fechacreacion, fechaactualizacion, eliminado} = req.body;
      connection.query(
        'INSERT INTO permiso (nombre, idcreador, idactualizacion, fechacreacion, fechaactualizacion, eliminado) VALUES (?, ?, ?, ?, ?, ?)',
        [nombre, idcreador, idactualizacion, fechacreacion, fechaactualizacion, eliminado],
        (err, results) => {
          if (err) {
            console.error(err); // Revisa este log para ver el error real
            return res.status(500).json({ error: 'Error al crear el permiso' });
          }
          res.status(201).json({ message: 'Permiso creado con éxito', permisoId: results.insertId });
        }
      );
    },
    
    // Actualizar un permiso por ID

    actualizarPermiso: async (req, res) => {
      const { id } = req.params;
      const { nombre, idcreador, idactualizacion, fechacreacion, fechaactualizacion} = req.body;

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

        if (fechaactualizacion) {
          updates.push('fechaactualizacion = ?');
          params.push(fechaactualizacion);
        }


        if (updates.length === 0) {
          return res.status(400).json({ message: 'Sin información' });
        }

        query += updates.join(', ') + ' WHERE idpermiso = ?';
        params.push(id);

        const [result] = await connection.promise().query(query, params);

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Permiso no econtrado' });
        }

        res.status(200).json({ message: 'Permiso actualizado exitosamente' });
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error' });
      }
    },


    // Eliminar un permiso por ID (soft delete o eliminación lógica)
    eliminarPermiso: async (req, res) => {
      const { id } = req.params;

      try {

        const [result] = await connection.promise().query(
          'UPDATE permiso SET eliminado = ? WHERE idpermiso = ?',
          [1, id]
        );

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Permiso no encontrada' });
        }

        res.status(200).json({ message: 'Permiso eliminado lógicamente' });
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error' });
      }
    }
  };
};


module.exports = (connection) => {
  return {
    // Obtener todos los módulos
    obtenerModulos: (req, res) => {
      connection.query('SELECT * FROM modulo', (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Error al obtener los módulos' });
        }
        res.status(200).json(results);
      });
    },

    // Obtener módulo por ID
    obtenrModuloPorId: (req, res) => {
      const { id } = req.params;
      connection.query(
        'SELECT * FROM modulo WHERE idmodulo = ?',
        [id],
        (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al obtener el módulo' });
          }
          if (results.length === 0) {
            return res.status(404).json({ error: 'Módulo no encontrado' });
          }
          res.status(200).json(results[0]);
        }
      );
    },

    // Crear un nuevo módulo
    crearModulo: (req, res) => {
      const {
        permiso_idpermiso,
        rol_idrol,
        idcreador,
        idactualizacion,
        fechacreacion,
        fechaactualizacion,
        eliminado,
      } = req.body;
      connection.query(
        'INSERT INTO modulo (permiso_idpermiso, rol_idrol, idcreador, idactualizacion, fechacreacion, fechaactualizacion, eliminado) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [permiso_idpermiso, rol_idrol, idcreador, idactualizacion, fechacreacion, fechaactualizacion, eliminado || 0],
        (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al crear el módulo' });
          }
          res.status(201).json({ message: 'Módulo creado con éxito', moduloId: results.insertId });
        }
      );
    },

    // Actualizar un módulo por ID
    actualizarModuloPorId: async (req, res) => {
      const { id } = req.params;
      const {rol_idrol, idcreador, idactualizacion, fechacreacion, fechaactualizacion,} = req.body;

      try {
        let query = 'UPDATE modulo SET ';
        const updates = [];
        const params = [];

        if (rol_idrol) {
          updates.push('rol_idrol = ?');
          params.push(rol_idrol);
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

        query += updates.join(', ') + ' WHERE idmodulo = ?';
        params.push(id);

        const [result] = await connection.promise().query(query, params);

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Modulo no econtrado' });
        }

        res.status(200).json({ message: 'Modulo actualizado exitosamente' });
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error' });
      }
    },


    // Eliminar un módulo por ID
    eliminarModuloPorId: async (req, res) => {
      const { id } = req.params;

      try {

        const [result] = await connection.promise().query(
          'UPDATE modulo SET eliminado = ? WHERE idmodulo = ?',
          [1, id]
        );

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Modulo no encontrada' });
        }

        res.status(200).json({ message: 'Modulo eliminado lógicamente' });
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error' });
      }
    }
  };
};

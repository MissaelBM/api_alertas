module.exports = (connection) => {
  return {
    // Obtener todos los módulos
    getModulos: (req, res) => {
      connection.query('SELECT * FROM modulo', (err, results) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ error: 'Error al obtener los módulos' });
        }
        res.status(200).json(results);
      });
    },

    // Obtener módulo por ID
    getModuloById: (req, res) => {
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
    createModulo: (req, res) => {
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
    updateModulo: (req, res) => {
      const { id } = req.params;
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
        'UPDATE modulo SET permiso_idpermiso = ?, rol_idrol = ?, idcreador = ?, idactualizacion = ?, fechacreacion = ?, fechaactualizacion = ?, eliminado = ? WHERE idmodulo = ?',
        [permiso_idpermiso, rol_idrol, idcreador, idactualizacion, fechacreacion, fechaactualizacion, eliminado, id],
        (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al actualizar el módulo' });
          }
          if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Módulo no encontrado' });
          }
          res.status(200).json({ message: 'Módulo actualizado con éxito' });
        }
      );
    },

    // Eliminar un módulo por ID
    deleteModulo: (req, res) => {
      const { id } = req.params;
      connection.query(
        'DELETE FROM modulo WHERE idmodulo = ?',
        [id],
        (err, results) => {
          if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al eliminar el módulo' });
          }
          if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Módulo no encontrado' });
          }
          res.status(200).json({ message: 'Módulo eliminado con éxito' });
        }
      );
    },
  };
};


module.exports = (connection) => {
  return {
    usuario: async (req, res) => {
      const { rol_idrol, email, contraseña, fechacreacion, fechaactualizacion, idcreador, idactualizacion } = req.body;

      try {
        const [rolResult] = await connection.promise().query(
          'SELECT idrol FROM rol WHERE idrol = ?',
          [rol_idrol]
        );

        if (rolResult.length === 0) {
          return res.status(400).json({ message: 'El rol especificado no existe' });
        }

        const hashedPasswordBinary = Buffer.from(contraseña, 'utf8');

        const [result] = await connection.promise().query(
          'INSERT INTO usuario (rol_idrol, email, contraseña, fechacreacion, fechaactualizacion, idcreador, idactualizacion, eliminado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [rol_idrol, email, hashedPasswordBinary, fechacreacion, fechaactualizacion, idcreador, idactualizacion, 0]
        );

        res.status(201).json({ message: 'Usuario registrado', userId: result.insertId });
      } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error al registrar usuario' });
      }
    },
    consultar: async (req, res) => {
      try {
        const [rows] = await connection.promise().query('SELECT * FROM usuario WHERE eliminado = ?', [0]);
        res.status(200).json(rows);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error' });
      }
    },


    consultarId: async (req, res) => {
      const { id } = req.params;

      try {
        const [rows] = await connection.promise().query('SELECT * FROM usuario WHERE idusuario = ? AND eliminado = ?', [id, 0]);

        if (rows.length === 0) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json(rows[0]);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error' });
      }
    },
    actualizarUsuario: async (req, res) => {
      const { id } = req.params;
      const { rol_idrol, email, contraseña, fechacreacion, fechaactualizacion, idcreador, idactualizacion } = req.body;

      try {
        let query = 'UPDATE usuario SET ';
        const updates = [];
        const params = [];

        if (rol_idrol) {
          updates.push('rol_idrol = ?');
          params.push(rol_idrol);
        }

        if (email) {
          updates.push('email = ?');
          params.push(email);
        }

        if (contraseña) {
          const hashedPasswordBinary = Buffer.from(contraseña, 'utf8');
          updates.push('contraseña = ?');
          params.push(hashedPasswordBinary);
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


        if (fechaactualizacion !== undefined) {
          updates.push('fechaactualizacion = ?');
          params.push(fechaactualizacion);
        }


        if (updates.length === 0) {
          return res.status(400).json({ message: 'Sin información' });
        }

        query += updates.join(', ') + ' WHERE idusuario = ?';
        params.push(id);

        const [result] = await connection.promise().query(query, params);

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Usuario no econtrado' });
        }

        res.status(200).json({ message: 'Usuario actualizado exitosamente' });
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error' });
      }
    },
    login: async (req, res) => {
      const { email, contraseña } = req.body;

      try {
        const [rows] = await connection.promise().query(
          'SELECT idusuario, rol_idrol, email, contraseña FROM usuario WHERE email = ? AND eliminado = 0',
          [email]
        );

        if (rows.length === 0) {
          return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
        }

        const user = rows[0];


        const storedPassword = user.contraseña.toString('utf8').replace(/\x00/g, '');


        console.log('Contraseña almacenada:', JSON.stringify(storedPassword));
        console.log('Contraseña ingresada:', JSON.stringify(contraseña));

        if (contraseña.trim() !== storedPassword.trim()) {
          return res.status(401).json({ message: 'Correo o contraseña incorrectos' });
        }

        res.json({
          message: 'Login exitoso',
          user: {
            idusuario: user.idusuario,
            email: user.email,
            rol_idrol: user.rol_idrol
          }
        });

      } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ message: 'Error en el servidor' });
      }
    },
    eliminarUsuario: async (req, res) => {
      const { id } = req.params;

      try {
        const [result] = await connection.promise().query(
          'UPDATE usuario SET eliminado = ? WHERE idusuario = ?',
          [true, id]
        );

        if (result.affectedRows === 0) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        res.status(200).json({ message: 'Usuario eliminado lógicamente' });
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error' });
      }
    }



  };
};
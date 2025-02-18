const bcrypt = require('bcrypt');

module.exports = (connection) => {
  return {
    usuario: async (req, res) => {
      const { rol_idrol, email, contraseña, fechacreacion, eliminado} = req.body;

      try {
        
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(contraseña, saltRounds);

      
        const [result] = await connection.promise().query(
          'INSERT INTO usuario (rol_idrol, email, contraseña, fechacreacion, eliminado) VALUES (?, ?, ?, ?, ?)',
          [rol_idrol, email, hashedPassword, fechacreacion, eliminado]
        );

        res.status(201).json({ message: 'Usuario registrado', userId: result.insertId });
      } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ message: 'Error al registrar usuario' });
      }
    },
    consultar: async (req, res) => {
      try {
        const [rows] = await connection.promise().query('SELECT * FROM usuario');
        res.status(200).json(rows);
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error' });
      }
    },

    
    consultarId: async (req, res) => {
      const { id } = req.params;

      try {
        const [rows] = await connection.promise().query('SELECT * FROM usuario WHERE idusuario = ?', [id]);

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
      const { rol_idrol, email, contraseña, estado } = req.body;

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
          const saltRounds = 10;
          const hashedPassword = await bcrypt.hash(contraseña, saltRounds);
          updates.push('contraseña = ?');
          params.push(hashedPassword);
        }

        if (estado !== undefined) {
          updates.push('estado = ?');
          params.push(estado);
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
        // Buscar usuario en la base de datos
        const [rows] = await connection.promise().query(
          'SELECT * FROM usuario WHERE email = ?',
          [email]
        );

        if (rows.length === 0) {
          return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const user = rows[0];

        // Verificar contraseña
        const isPasswordValid = await bcrypt.compare(contraseña, user.contraseña);

        if (!isPasswordValid) {
          return res.status(401).json({ message: 'Contraseña inválida' });
        }

        res.status(200).json({ message: 'Inicio de sesión exitoso', userId: user.id });
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error' });
      }
    }
      


  };
};
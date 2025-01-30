module.exports = (connection)=>{
  return{
    consultar: async (req, res) => {
        try {
          const [rows] = await connection.promise().query('SELECT * FROM rol');
          res.status(200).json(rows);
        } catch (error) {
          console.error('Error:', error);
          res.status(500).json({ message: 'Error' });
        }
      },
      rol: async (req, res) => {
            const {nombre} = req.body;
      
            try {
            
              const [result] = await connection.promise().query(
                'INSERT INTO rol (nombre) VALUES (?)',
                [nombre]
              );
      
              res.status(201).json({ message: 'Rol registrado', rolId: result.insertId });
            } catch (error) {
              console.error('Error al registrar rol:', error);
              res.status(500).json({ message: 'Error al registrar rol' });
            }
          }
  };
};
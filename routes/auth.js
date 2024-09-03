const express = require('express');
const jwt = require('jsonwebtoken');//Es el módulo que permite trabajar con JSON Web Tokens (JWT), que son usados para autenticar usuarios de manera segura.
const User = require('../models/User'); //importa modelo creado User

const router = express.Router(); //permite definir rutas en un archivo separado y luego montarlas en la aplicación principa

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => { //regitra usuario a partir de un POST
    const { username, email, password } = req.body; //Contiene los datos enviados por el cliente (generalmente, el formulario de registro), y se desestructura para obtener username, email, y password

    try {
        const user = new User({ username, email, password }); // Crea una nueva instancia del modelo User con los datos proporcionados.
        await user.save(); //Guarda el usuario en la base de datos 

        const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' }); //Se crea un token JWT que contiene el ID del usuario. El token se firma con una clave secreta  y tiene una duración de 1 hora

        res.status(201).json({ token });
    } catch (error) {
        res.status(400).json({ message: 'Error al registrar el usuario', error });
    }
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }); //Busca en la base de datos un usuario con el correo electrónico proporcionado.
        if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

        const isMatch = await user.matchPassword(password);//Utiliza el método matchPassword definido en el modelo User para comparar la contraseña ingresada con la almacenada en la base de datos.
        if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

        const token = jwt.sign({ id: user._id }, 'secret', { expiresIn: '1h' }); //Si el correo electrónico y la contraseña son correctos, se genera un token JWT para el usuario

        res.status(200).json({ token });
    } catch (error) {
        res.status(400).json({ message: 'Error al iniciar sesión', error });
    }
});

module.exports = router; //se exporta para poder usado dentro del proyecto
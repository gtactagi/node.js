const express = require('express'); //Importa el módulo express, un framework de Node.js que facilita la construcción de aplicaciones web y APIs. Al usar require, se obteniene una instancia del módulo express que puede utilizarse en el código
const mongoose = require('mongoose'); //Importa el módulo mongoose, que es una biblioteca de Node.js para trabajar con MongoDB.
const authRoutes = require('./routes/auth');
const plantRoutes = require('./routes/plants');
const activityRouter = require('./routes/activities');


//crea instancia de express
const app = express();

// Parsea JSON
app.use(express.json()); //Configura un middleware en Express para que todas las peticiones que lleguen con un cuerpo en formato JSON sean automáticamente parseadas (convertidas) a objetos JavaScript.

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/plantas', { useNewUrlParser: true, useUnifiedTopology: true }) // useNew y UseUnified sirven para eliminar advertencias de versiones antiguas del analizador de URL
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('No se pudo conectar a MongoDB', err));

//Ruta de actividades
app.use('/api', activityRouter);

// Rutas de autenticación
app.use('/api/auth', authRoutes);

// Rutas de plantas
app.use('/api/plants', plantRoutes);

// Ruta de prueba
app.get('/', (req, res) => {  //Define una ruta básica para manejar solicitudes GET en la raíz del sitio (/). Cuando un usuario visita la URL base del servidor (por ejemplo, http://localhost:3000/), se ejecutará esta función.
    res.send('¡Bienvenido a la API de Seguimiento de Plantas!'); //respuesta
});

// Configurar el puerto 3000 y escuchar las peticiones
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en el puert ${port}`);
});
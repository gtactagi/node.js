const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); //: Es una biblioteca que se utiliza para encriptar contraseñas de manera segura. Ofrece métodos para generar un "hash" de una contraseña y compararla con una contraseña ingresada

const userSchema = new mongoose.Schema({ //userSchema es un esquema que define la estructura de los documentos de usuario en MongoDB.
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true, //obligatorio
        unique: true    //unico
    },
    password: {
        type: String,
        required: true
    }
});

// Método para encriptar la contraseña antes de guardarla
userSchema.pre('save', async function (next) { //se ejecuta en mongoose antes que un doc sea guardado en base de datos
    if (!this.isModified('password')) return next(); //verifica que el campo password haya sido modificado
    const salt = await bcrypt.genSalt(10); //si la contraseña fue modificada genera salt(valor aleatorio para luego sea encriptado.
    this.password = await bcrypt.hash(this.password, salt); // encripta la contraseña del usuario utilizando el salt generado, y el hash resultante reemplaza la contraseña original en el objeto del usuario
    next();
});

// Método para comparar contraseñas, toma como argumento la contraeña ingresada por usuario y si coincida con encriptada devuelve true
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema); //se crea un modelo llamado User basado en el esquema
module.exports = User; // se exporta el modelo User para que pueda ser utilizado en otros archivos dentro del proyecto.
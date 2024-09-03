const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'No hay token, autorización denegada' });
    }

    try {
        const decoded = jwt.verify(token, 'secret');
        req.user = await User.findById(decoded.id);
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token no es válido' });
    }
};

module.exports = { authMiddleware };
const express = require('express');
const Activity = require('../models/Activity');
const authMiddleware = require('../middleware/authMiddleware');
const router = new express.Router();

// Crear una nueva actividad
router.post('/activities', authMiddleware, async (req, res) => {
    const { plant, description, date } = req.body;
    const user = req.user._id;

    try {
        const activity = new Activity({ plant, description, date, user });
        await activity.save();
        // Enviar alerta por correo electrónico
        sendMail('recipient-email@example.com', 'Nueva Actividad de Planta', `Se ha registrado una nueva actividad: ${description}`);
        
        res.status(201).send(activity);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Obtener todas las actividades
router.get('/activities', authMiddleware, async (req, res) => {
    try {
        const activities = await Activity.find().populate('plant').populate('user');
        res.status(200).send(activities);
    } catch (error) {
        res.status(500).send(error);
    }
});

// Actualizar una actividad
router.put('/activities/:id', authMiddleware, async (req, res) => {
    const _id = req.params.id;
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'date'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Operaciones inválidas' });
    }

    try {
        const activity = await Activity.findById(_id);
        if (!activity) {
            return res.status(404).send();
        }
        updates.forEach(update => activity[update] = req.body[update]);
        await activity.save();
        res.send(activity);
    } catch (error) {
        res.status(400).send(error);
    }
});

// Eliminar una actividad
router.delete('/activities/:id', authMiddleware, async (req, res) => {
    try {
        const activity = await Activity.findByIdAndDelete(req.params.id);
        if (!activity) {
            return res.status(404).send();
        }
        res.send(activity);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
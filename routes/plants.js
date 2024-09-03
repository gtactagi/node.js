const express = require('express');
const Plant = require('../models/Plant');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Crear una nueva planta
router.post('/', authMiddleware, async (req, res) => {
    const { name, species, acquisitionDate, location } = req.body;

    try {
        const plant = new Plant({ 
            name, 
            species, 
            acquisitionDate, 
            location, 
            user: req.user.id 
        });
        await plant.save();
        res.status(201).json(plant);
    } catch (error) {
        res.status(400).json({ message: 'Error al crear la planta', error });
    }
});


// Obtener todas las plantas del usuario
router.get('/', authMiddleware, async (req, res) => {
    try {
        const plants = await Plant.find({ user: req.user.id });
        res.status(200).json(plants);
    } catch (error) {
        res.status(400).json({ message: 'Error al obtener las plantas', error });
    }
});

// Actualizar una planta
router.put('/:id', authMiddleware, async (req, res) => {
    const { name, species, acquisitionDate, location } = req.body;

    try {
        const plant = await Plant.findByIdAndUpdate(req.params.id, 
            { name, species, acquisitionDate, location }, 
            { new: true }
        );
        res.status(200).json(plant);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar la planta', error });
    }
});

// Eliminar una planta
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        await Plant.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Planta eliminada con éxito' });
    } catch (error) {
        res.status(400).json({ message: 'Error al eliminar la planta', error });
    }
});

module.exports = router;
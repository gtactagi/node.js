//actividades relacionadas con las plantas.Ejemplo guarda información sobre la actividad realizada, la fecha y la planta asociada.

const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
    plant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plant',
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

const Activity = mongoose.model('Activity', activitySchema);
module.exports = Activity;
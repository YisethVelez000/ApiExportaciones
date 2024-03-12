const mongoose = require('mongoose');

const exportacionSchema = mongoose.Schema({
    producto: {
        type: String,
        required: true,
        min: 3,
        max: 255
    },
    kilos: {
        type: Number,
        required: true
    },
    precioKilo: {
        type: Number,
        required: true,
        
    },
    precioActualDolar: {
        type: Number,
        required: true
    },
});

module.exports = mongoose.model('Exportacion', exportacionSchema);
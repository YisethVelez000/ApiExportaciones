const mongoose = require('mongoose');

  
  const exportacion1Schema = mongoose.Schema({
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
      // Establece el precio actual del dólar como valor predeterminado
    },
  });
  
  module.exports = mongoose.model('Exportacion', exportacion1Schema);
  

module.exports = mongoose.model('Exportacion', exportacion1Schema);
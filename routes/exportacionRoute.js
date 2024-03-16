const mongoose = require('mongoose');
const Exportacion = require('../models/exportacion');
const express = require('express');
const router = express.Router();
const cors = require('cors');
const Joi = require('@hapi/joi');
const bodyParser = require('body-parser');

// Función para obtener el precio del dólar
async function obtenerPrecioDolar() {
    try {
      const url = 'https://www.datos.gov.co/resource/mcec-87by.json';
      const response = await fetch(url);
      const data = await response.json();
  
      // Asegúrate de que la respuesta tenga datos y al menos un elemento
      if (Array.isArray(data) && data.length > 0) {
        const precioDolar = parseInt(data[0].valor); // Suponiendo que el campo se llama 'valor'
        return precioDolar;
      } else {
        console.log('No se encontraron datos válidos en la respuesta.');
        return null;
      }
    } catch (error) {
      console.error('Error al obtener el precio del dólar:', error.message);
      return null;
    }
  }
  
  // Función para obtener el precio actual del dólar y establecerlo como valor predeterminado

   var precioDolar = obtenerPrecioDolar();

const SchemaRegister = Joi.object({
    producto: Joi.string().min(3).max(255).required(),
    kilos: Joi.number()..float().required(),
    precioKilo: Joi.number().float().required(),
    precioActualDolar: Joi.number().default(precioDolar)
});

//usamos cors para poder hacer peticiones desde el front
router.use(cors());

// Configura el body parser
router.use(bodyParser.urlencoded({ extended: false })); 

router.post('/exportacion', async (req, res) => {
    const precioDolar = await obtenerPrecioDolar();
    try {
        const { error } = SchemaRegister.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: true,
                mensaje: error.details[0].message
            });
        }

        const { producto, kilos, precioKilo } = req.body;
        const newExportacion = new Exportacion({
            producto,
            kilos,
            precioKilo,
            precioActualDolar:precioDolar
        });
        const exportacion = await newExportacion.save();
        res.json({
            error: null,
            data: exportacion
        });
    } catch (error) {
        res.status(400).json({ error });
    }
});


router.get('/exportacion', async (req, res) => {
    try {
        const exportacion = await Exportacion.find();
        res.json(exportacion);
    } catch (error) {
        res.status(400).json({ error });
    }
});

router.get('/exportacion/:id', async (req, res) => {
    try {
        const exportacion = await Exportacion.findById(req.params.id);
        res.json(exportacion);
    } catch (error) {
        res.status(400).json({ error });
    }
});

router.put('/exportacion/:id', async (req, res) => {
    try {
        const { error } = SchemaRegister.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: true,
                mensaje: error.details[0].message
            });
        }
        const { producto, kilos, precioKilo} = req.body;
        const newExportacion = {
            producto,
            kilos,
            precioKilo,
        };
        const exportacion = await Exportacion.findByIdAndUpdate(req.params.id, newExportacion);
        res.json({
            error: null,
            data: exportacion
        });
    } catch (error) {
        res.status(400).json({ error });
    }
});

router.delete('/exportacion/:id', async (req, res) => {
    try {
        const exportacion = await Exportacion.findByIdAndDelete(req.params.id);
        res.json(exportacion);
    } catch (error) {
        res.status(400).json({ error });
    }
});

module.exports = router;

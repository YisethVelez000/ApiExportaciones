const mongoose = require('mongoose');
const Exportacion = require('../models/exportacion');
const express = require('express');
const router = express.Router();
const cors = require('cors');
const Joi = require('@hapi/joi');
const bodyParser = require('body-parser');

const SchemaRegister = Joi.object({
    producto: Joi.string().min(3).max(255).required(),
    kilos: Joi.number().required(),
    precioKilo: Joi.number().required(),
    precioActualDolar: Joi.number().required()
});

//usamos cors para poder hacer peticiones desde el front
router.use(cors());



// Configura el body parser
router.use(bodyParser.urlencoded({ extended: false })); 

router.post('/exportacion', async (req, res) => {
    try {
        const { error } = SchemaRegister.validate(req.body);
        if (error) {
            return res.status(400).json({
                error: true,
                mensaje: error.details[0].message
            });
        }

        const { producto, kilos, precioKilo, precioActualDolar } = req.body;
        const newExportacion = new Exportacion({
            producto,
            kilos,
            precioKilo,
            precioActualDolar
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
        const { producto, kilos, precioKilo, precioActualDolar } = req.body;
        const newExportacion = {
            producto,
            kilos,
            precioKilo,
            precioActualDolar
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
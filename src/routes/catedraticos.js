const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener todos los catedráticos
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Catedraticos');
        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Crear un nuevo catedrático
router.post('/', async (req, res) => {
    const { NombreCompleto, FechaContratacion, FechaNacimiento, Genero, Titulo, Salario } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Catedraticos (NombreCompleto, FechaContratacion, FechaNacimiento, Genero, Titulo, Salario) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [NombreCompleto, FechaContratacion, FechaNacimiento, Genero, Titulo, Salario]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;

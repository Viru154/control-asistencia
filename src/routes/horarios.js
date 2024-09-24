const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener todos los horarios
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Horarios');
        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Obtener un horario por ID
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM Horarios WHERE id_horario = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Horario no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Crear un nuevo horario
router.post('/', async (req, res) => {
    const { id_catedratico, Curso, HoraInicio, HoraFin } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO Horarios (id_catedratico, Curso, HoraInicio, HoraFin) VALUES ($1, $2, $3, $4) RETURNING *',
            [id_catedratico, Curso, HoraInicio, HoraFin]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Actualizar un horario existente
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { id_catedratico, Curso, HoraInicio, HoraFin } = req.body;
    try {
        const result = await pool.query(
            'UPDATE Horarios SET id_catedratico = $1, Curso = $2, HoraInicio = $3, HoraFin = $4 WHERE id_horario = $5 RETURNING *',
            [id_catedratico, Curso, HoraInicio, HoraFin, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Horario no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Eliminar un horario
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM Horarios WHERE id_horario = $1 RETURNING *', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Horario no encontrado' });
        }
        res.status(204).send(); // Sin contenido
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;

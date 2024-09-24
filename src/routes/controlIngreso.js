const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener todos los registros de ingreso
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM ControlIngreso');
        res.json(result.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Crear un nuevo registro de ingreso
router.post('/', async (req, res) => {
    const { id_Catedratico, FechaHoraIngreso, FechaHoraSalida, Estatus } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO ControlIngreso (id_Catedratico, FechaHoraIngreso, FechaHoraSalida, Estatus) VALUES ($1, $2, $3, $4) RETURNING *',
            [id_Catedratico, FechaHoraIngreso, FechaHoraSalida, Estatus]
        );

        // Verificar inasistencias
        if (!Estatus) {  // Si Estatus es FALSE (0), cuenta como inasistencia
            const inasistencias = await pool.query(
                'SELECT COUNT(*) FROM ControlIngreso WHERE id_Catedratico = $1 AND Estatus = FALSE',
                [id_Catedratico]
            );
            if (parseInt(inasistencias.rows[0].count) >= 3) {
                await pool.query(
                    'INSERT INTO LogMoras (id_Catedratico, Motivo) VALUES ($1, $2)',
                    [id_Catedratico, 'Mora por 3 inasistencias']
                );
            }
        }

        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Actualizar un registro de ingreso (opcional)
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { FechaHoraIngreso, FechaHoraSalida, Estatus } = req.body;
    try {
        const result = await pool.query(
            'UPDATE ControlIngreso SET FechaHoraIngreso = $1, FechaHoraSalida = $2, Estatus = $3 WHERE id_ingreso = $4 RETURNING *',
            [FechaHoraIngreso, FechaHoraSalida, Estatus, id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Eliminar un registro de ingreso (opcional)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM ControlIngreso WHERE id_ingreso = $1', [id]);
        res.status(204).send(); // Sin contenido
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;

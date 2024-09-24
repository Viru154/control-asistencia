const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

const catedraticosRoutes = require('./routes/catedraticos');
const horariosRoutes = require('./routes/horarios');
const controlIngresoRoutes = require('./routes/controlIngreso');

app.use(bodyParser.json());

app.use('/api/catedraticos', catedraticosRoutes);
app.use('/api/horarios', horariosRoutes);
app.use('/api/control-ingreso', controlIngresoRoutes);

app.listen(port, () => {
    console.log(`Servidor corriendo en puerto ${port}`);
});

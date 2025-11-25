require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const app = express();

// Middlewares
app.use(morgan('dev')); // Logging [cite: 1122]
app.use(express.json()); // Body Parser [cite: 1129]

// TODO: Cargar Rutas (lo haremos en Clase 2)
const productRoutes = require('./src/presentation/routes/product.routes');
app.use('/api/v1/products', productRoutes);

// Healthcheck Endpoint (para probar)
app.get('/api/v1/healthcheck', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
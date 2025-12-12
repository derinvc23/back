require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./src/presentation/swagger.config');
const { connectDB } = require('./src/infrastructure/repositories/database/mongo/config');
const errorHandler = require('./src/presentation/middlewares/error.handler');
const app = express();

// Conectar a MongoDB
connectDB();

// Middlewares
app.use(morgan('dev')); // Logging
app.use(express.json()); // Body Parser

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Cargar Rutas
const productRoutes = require('./src/presentation/routes/product.routes');
const orderRoutes = require('./src/presentation/routes/order.routes');
const userRoutes = require('./src/presentation/routes/user.routes');
const roleRoutes = require('./src/presentation/routes/role.routes');
const authRoutes = require('./src/presentation/routes/auth.routes');
const cuponRoutes = require('./src/presentation/routes/cupon.routes');

app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/roles', roleRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/cupons', cuponRoutes);

// Healthcheck Endpoint (para probar)
app.get('/api/v1/healthcheck', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// Error Handler Middleware (debe estar AL FINAL, después de todas las rutas)
app.use(errorHandler);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
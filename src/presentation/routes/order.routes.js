const { Router } = require('express');
const OrderController = require('../controller/order.controller');

// Esta es la "Inyección de Dependencias" manual
const OrderService = require('../../application/use-cases/order.service');
const OrderMongoRepository = require('../../infrastructure/repositories/database/mongo/order.mongo.repository');

const orderRepository = new OrderMongoRepository();
const orderService = new OrderService(orderRepository);
const orderController = new OrderController(orderService);

const router = Router();

// CRUD completo
router.get('/', orderController.getAll);
router.get('/:id', orderController.getById);
router.post('/', orderController.create);
router.put('/:id', orderController.update);
router.delete('/:id', orderController.delete);

module.exports = router;

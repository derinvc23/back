const { Router } = require('express');
const OrderController = require('../controller/order.controller');
const OrderService = require('../../application/use-cases/order.service');
const OrderMongoRepository = require('../../infrastructure/repositories/database/mongo/order.mongo.repository');
const asyncHandler = require('../utils/async.handler');
const authenticateToken = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/admin.middleware');

const orderRepository = new OrderMongoRepository();
const orderService = new OrderService(orderRepository);
const orderController = new OrderController(orderService);

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Gestión de órdenes
 */

/**
 * @swagger
 * /api/v1/orders:
 *   get:
 *     summary: Obtener todas las órdenes
 *     tags: [Orders]
 *     responses:
 *       200:
 *         description: Lista de órdenes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   orderNumber:
 *                     type: string
 *                   customerName:
 *                     type: string
 *                   customerEmail:
 *                     type: string
 *                   items:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         productId:
 *                           type: string
 *                         productName:
 *                           type: string
 *                         description:
 *                           type: string
 *                         quantity:
 *                           type: number
 *                         price:
 *                           type: number
 *                         discount:
 *                           type: number
 *                   subtotal:
 *                     type: number
 *                   totalDiscount:
 *                     type: number
 *                   total:
 *                     type: number
 *                   status:
 *                     type: string
 *                     enum: [pending, confirmed, shipped, delivered, cancelled]
 *                   orderDate:
 *                     type: string
 *                     format: date-time
 */
router.get('/', asyncHandler(orderController.getAll));

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   get:
 *     summary: Obtener orden por ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la orden
 *     responses:
 *       200:
 *         description: Orden encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 orderNumber:
 *                   type: string
 *                 customerName:
 *                   type: string
 *                 customerEmail:
 *                   type: string
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       productId:
 *                         type: string
 *                       productName:
 *                         type: string
 *                       description:
 *                         type: string
 *                       quantity:
 *                         type: number
 *                       price:
 *                         type: number
 *                       discount:
 *                         type: number
 *                 subtotal:
 *                   type: number
 *                 totalDiscount:
 *                   type: number
 *                 total:
 *                   type: number
 *                 status:
 *                   type: string
 *                 orderDate:
 *                   type: string
 *                   format: date-time
 *       404:
 *         description: Orden no encontrada
 */
router.get('/:id', asyncHandler(orderController.getById));

/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     summary: Crear nueva orden
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderNumber
 *               - customerName
 *               - customerEmail
 *               - items
 *             properties:
 *               orderNumber:
 *                 type: string
 *                 example: ORD-2024-001
 *               customerName:
 *                 type: string
 *                 example: María García
 *               customerEmail:
 *                 type: string
 *                 format: email
 *                 example: maria@example.com
 *               items:
 *                 type: array
 *                 minItems: 1
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - productName
 *                     - quantity
 *                     - price
 *                   properties:
 *                     productId:
 *                       type: string
 *                       example: 507f1f77bcf86cd799439011
 *                     productName:
 *                       type: string
 *                       example: Laptop HP
 *                     description:
 *                       type: string
 *                       example: Laptop de alta gama
 *                     quantity:
 *                       type: number
 *                       example: 2
 *                     price:
 *                       type: number
 *                       example: 999.99
 *                     discount:
 *                       type: number
 *                       example: 50
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, shipped, delivered, cancelled]
 *                 default: pending
 *               orderDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Orden creada exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - Se requiere rol de administrador
 */
router.post('/', [authenticateToken, isAdmin], asyncHandler(orderController.create));

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   put:
 *     summary: Actualizar orden
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la orden
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderNumber
 *               - customerName
 *               - customerEmail
 *               - items
 *             properties:
 *               orderNumber:
 *                 type: string
 *               customerName:
 *                 type: string
 *               customerEmail:
 *                 type: string
 *                 format: email
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     productName:
 *                       type: string
 *                     description:
 *                       type: string
 *                     quantity:
 *                       type: number
 *                     price:
 *                       type: number
 *                     discount:
 *                       type: number
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, shipped, delivered, cancelled]
 *               orderDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Orden actualizada exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - Se requiere rol de administrador
 *       404:
 *         description: Orden no encontrada
 */
router.put('/:id', [authenticateToken, isAdmin], asyncHandler(orderController.update));

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   delete:
 *     summary: Eliminar orden
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la orden
 *     responses:
 *       204:
 *         description: Orden eliminada exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - Se requiere rol de administrador
 *       404:
 *         description: Orden no encontrada
 */
router.delete('/:id', [authenticateToken, isAdmin], asyncHandler(orderController.delete));

module.exports = router;

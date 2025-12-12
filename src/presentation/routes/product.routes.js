const { Router } = require('express');
const ProductController = require('../controller/product.controller');
const ProductService = require('../../application/use-cases/product.service');
const ProductMongoRepository = require('../../infrastructure/repositories/database/mongo/product.mongo.repository');
const asyncHandler = require('../utils/async.handler');
const authenticateToken = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/admin.middleware');

const productRepository = new ProductMongoRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gestión de productos
 */

/**
 * @swagger
 * /api/v1/products:
 *   get:
 *     summary: Obtener todos los productos
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   price:
 *                     type: number
 *                   stock:
 *                     type: number
 *                   category:
 *                     type: string
 *                   brand:
 *                     type: string
 *                   imageUrl:
 *                     type: string
 */
router.get('/', asyncHandler(productController.getAll));

/**
 * @swagger
 * /api/v1/products/{id}:
 *   get:
 *     summary: Obtener producto por ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 description:
 *                   type: string
 *                 price:
 *                   type: number
 *                 stock:
 *                   type: number
 *                 category:
 *                   type: string
 *                 brand:
 *                   type: string
 *                 imageUrl:
 *                   type: string
 *       404:
 *         description: Producto no encontrado
 */
router.get('/:id', asyncHandler(productController.getById));

/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     summary: Crear nuevo producto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - stock
 *               - category
 *               - brand
 *             properties:
 *               name:
 *                 type: string
 *                 example: Laptop HP
 *               description:
 *                 type: string
 *                 example: Laptop de alta gama con procesador Intel i7
 *               price:
 *                 type: number
 *                 example: 999.99
 *               stock:
 *                 type: number
 *                 example: 50
 *               category:
 *                 type: string
 *                 example: Electrónica
 *               brand:
 *                 type: string
 *                 example: Samsung
 *               imageUrl:
 *                 type: string
 *                 example: https://example.com/laptop.jpg
 *     responses:
 *       201:
 *         description: Producto creado exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - Se requiere rol de administrador
 */
router.post('/', [authenticateToken, isAdmin], asyncHandler(productController.create));

/**
 * @swagger
 * /api/v1/products/{id}:
 *   put:
 *     summary: Actualizar producto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - stock
 *               - category
 *               - brand
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               category:
 *                 type: string
 *               brand:
 *                 type: string
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Producto actualizado exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - Se requiere rol de administrador
 *       404:
 *         description: Producto no encontrado
 */
router.put('/:id', [authenticateToken, isAdmin], asyncHandler(productController.update));

/**
 * @swagger
 * /api/v1/products/{id}:
 *   delete:
 *     summary: Eliminar producto
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del producto
 *     responses:
 *       204:
 *         description: Producto eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - Se requiere rol de administrador
 *       404:
 *         description: Producto no encontrado
 */
router.delete('/:id', [authenticateToken, isAdmin], asyncHandler(productController.delete));

module.exports = router;
const { Router } = require('express');
const CuponController = require('../controller/cupon.controller');
const CuponService = require('../../application/use-cases/cupon.service');
const CuponMongoRepository = require('../../infrastructure/repositories/database/mongo/cupon.mongo.repository');
const asyncHandler = require('../utils/async.handler');
const authenticateToken = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/admin.middleware');

const cuponRepository = new CuponMongoRepository();
const cuponService = new CuponService(cuponRepository);
const cuponController = new CuponController(cuponService);

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Cupons
 *   description: Gestión de cupones de descuento
 */

/**
 * @swagger
 * /api/v1/cupons:
 *   get:
 *     summary: Obtener todos los cupones
 *     description: Lista todos los cupones disponibles. Requiere autenticación y rol de administrador.
 *     tags: [Cupons]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de cupones
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   code:
 *                     type: string
 *                   discountType:
 *                     type: string
 *                     enum: [percentage, fixed]
 *                   discountValue:
 *                     type: number
 *                   minPurchase:
 *                     type: number
 *                   maxUses:
 *                     type: number
 *                   currentUses:
 *                     type: number
 *                   expirationDate:
 *                     type: string
 *                     format: date-time
 *                   isActive:
 *                     type: boolean
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - Se requiere rol de administrador
 */
router.get('/', [authenticateToken, isAdmin], asyncHandler(cuponController.getAll));

/**
 * @swagger
 * /api/v1/cupons/{id}:
 *   get:
 *     summary: Obtener cupón por ID
 *     description: Obtiene un cupón específico por su ID. Requiere autenticación y rol de administrador.
 *     tags: [Cupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cupón
 *     responses:
 *       200:
 *         description: Cupón encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 code:
 *                   type: string
 *                 discountType:
 *                   type: string
 *                   enum: [percentage, fixed]
 *                 discountValue:
 *                   type: number
 *                 minPurchase:
 *                   type: number
 *                 maxUses:
 *                   type: number
 *                 currentUses:
 *                   type: number
 *                 expirationDate:
 *                   type: string
 *                   format: date-time
 *                 isActive:
 *                   type: boolean
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - Se requiere rol de administrador
 *       404:
 *         description: Cupón no encontrado
 */
router.get('/:id', [authenticateToken, isAdmin], asyncHandler(cuponController.getById));

/**
 * @swagger
 * /api/v1/cupons/code/{code}:
 *   get:
 *     summary: Obtener cupón por código
 *     description: Obtiene un cupón específico por su código. Endpoint público para validar cupones en el checkout.
 *     tags: [Cupons]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Código del cupón
 *         example: VERANO2024
 *     responses:
 *       200:
 *         description: Cupón encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 code:
 *                   type: string
 *                 discountType:
 *                   type: string
 *                   enum: [percentage, fixed]
 *                 discountValue:
 *                   type: number
 *                 minPurchase:
 *                   type: number
 *                 maxUses:
 *                   type: number
 *                 currentUses:
 *                   type: number
 *                 expirationDate:
 *                   type: string
 *                   format: date-time
 *                 isActive:
 *                   type: boolean
 *       404:
 *         description: Cupón no encontrado
 */
router.get('/code/:code', asyncHandler(cuponController.getByCode));

/**
 * @swagger
 * /api/v1/cupons:
 *   post:
 *     summary: Crear nuevo cupón
 *     description: Crea un nuevo cupón de descuento. Requiere autenticación y rol de administrador.
 *     tags: [Cupons]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - discountType
 *               - discountValue
 *             properties:
 *               code:
 *                 type: string
 *                 example: VERANO2024
 *                 description: Código único del cupón (se convertirá a mayúsculas)
 *               discountType:
 *                 type: string
 *                 enum: [percentage, fixed]
 *                 example: percentage
 *                 description: Tipo de descuento (porcentaje o valor fijo)
 *               discountValue:
 *                 type: number
 *                 example: 20
 *                 description: Valor del descuento (20 para 20% o $20)
 *               minPurchase:
 *                 type: number
 *                 example: 100
 *                 description: Compra mínima requerida para usar el cupón
 *               maxUses:
 *                 type: number
 *                 example: 100
 *                 description: Máximo de usos permitidos (null = ilimitado)
 *               expirationDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-12-31T23:59:59Z
 *                 description: Fecha de expiración del cupón (null = no expira)
 *               isActive:
 *                 type: boolean
 *                 example: true
 *                 description: Si el cupón está activo o no
 *     responses:
 *       201:
 *         description: Cupón creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - Se requiere rol de administrador
 *       409:
 *         description: El código del cupón ya existe
 */
router.post('/', [authenticateToken, isAdmin], asyncHandler(cuponController.create));

/**
 * @swagger
 * /api/v1/cupons/{id}:
 *   put:
 *     summary: Actualizar cupón
 *     description: Actualiza un cupón existente. Requiere autenticación y rol de administrador.
 *     tags: [Cupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cupón
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 example: VERANO2024
 *               discountType:
 *                 type: string
 *                 enum: [percentage, fixed]
 *                 example: percentage
 *               discountValue:
 *                 type: number
 *                 example: 20
 *               minPurchase:
 *                 type: number
 *                 example: 100
 *               maxUses:
 *                 type: number
 *                 example: 100
 *               currentUses:
 *                 type: number
 *                 example: 50
 *               expirationDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-12-31T23:59:59Z
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Cupón actualizado exitosamente
 *       400:
 *         description: Datos inválidos
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - Se requiere rol de administrador
 *       404:
 *         description: Cupón no encontrado
 *       409:
 *         description: El código del cupón ya existe
 */
router.put('/:id', [authenticateToken, isAdmin], asyncHandler(cuponController.update));

/**
 * @swagger
 * /api/v1/cupons/{id}:
 *   delete:
 *     summary: Eliminar cupón
 *     description: Elimina un cupón existente. Requiere autenticación y rol de administrador.
 *     tags: [Cupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del cupón
 *     responses:
 *       204:
 *         description: Cupón eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - Se requiere rol de administrador
 *       404:
 *         description: Cupón no encontrado
 */
router.delete('/:id', [authenticateToken, isAdmin], asyncHandler(cuponController.delete));

/**
 * @swagger
 * /api/v1/cupons/validate/{code}:
 *   post:
 *     summary: Validar cupón
 *     description: Valida si un cupón es usable (activo, no expirado, con usos disponibles). Endpoint público.
 *     tags: [Cupons]
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Código del cupón
 *         example: VERANO2024
 *     responses:
 *       200:
 *         description: Resultado de la validación
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 valid:
 *                   type: boolean
 *                   example: true
 *                 cupon:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     code:
 *                       type: string
 *                     discountType:
 *                       type: string
 *                     discountValue:
 *                       type: number
 *                     minPurchase:
 *                       type: number
 *                 message:
 *                   type: string
 *                   example: Cupon is valid
 *       400:
 *         description: Cupón no válido (inactivo, expirado o sin usos disponibles)
 *       404:
 *         description: Cupón no encontrado
 */
router.post('/validate/:code', asyncHandler(cuponController.validate));

/**
 * @swagger
 * /api/v1/cupons/apply/{code}:
 *   post:
 *     summary: Aplicar cupón
 *     description: Aplica un cupón incrementando su contador de usos. Requiere autenticación.
 *     tags: [Cupons]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Código del cupón
 *         example: VERANO2024
 *     responses:
 *       200:
 *         description: Cupón aplicado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 applied:
 *                   type: boolean
 *                   example: true
 *                 cupon:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     code:
 *                       type: string
 *                     currentUses:
 *                       type: number
 *                 message:
 *                   type: string
 *                   example: Cupon applied successfully
 *       400:
 *         description: Cupón no válido (inactivo, expirado o sin usos disponibles)
 *       401:
 *         description: No autorizado
 *       404:
 *         description: Cupón no encontrado
 */
router.post('/apply/:code', authenticateToken, asyncHandler(cuponController.apply));

module.exports = router;

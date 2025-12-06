const { Router } = require('express');
const UserController = require('../controller/user.controller');
const UserService = require('../../application/use-cases/user.service');
const UserMongoRepository = require('../../infrastructure/repositories/database/mongo/user.mongo.repository');
const RoleMongoRepository = require('../../infrastructure/repositories/database/mongo/role.mongo.repository');
const asyncHandler = require('../utils/async.handler');
const authenticateToken = require('../middlewares/auth.middleware');
const isAdmin = require('../middlewares/admin.middleware');

const userRepository = new UserMongoRepository();
const roleRepository = new RoleMongoRepository();
const userService = new UserService(userRepository, roleRepository);
const userController = new UserController(userService);

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestión de usuarios
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Obtener todos los usuarios
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
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
 *                   email:
 *                     type: string
 *                   roles:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - Se requiere rol de administrador
 */
router.get('/', [authenticateToken, isAdmin], asyncHandler(userController.getAll));

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 roles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - Se requiere rol de administrador
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:id', [authenticateToken, isAdmin], asyncHandler(userController.getById));

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Registrar nuevo usuario
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - roles
 *             properties:
 *               name:
 *                 type: string
 *                 example: Juan Pérez
 *               email:
 *                 type: string
 *                 format: email
 *                 example: juan@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: password123
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["user"]
 *                 description: Array de nombres de roles
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Datos inválidos o falta un rol requerido
 *       404:
 *         description: Rol especificado no encontrado
 *       409:
 *         description: El email ya está registrado
 */
router.post('/', asyncHandler(userController.create));

/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: Actualizar usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Opcional - solo si se desea cambiar
 *               roles:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array de nombres de roles
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - Se requiere rol de administrador
 *       404:
 *         description: Usuario o rol no encontrado
 *       409:
 *         description: El email ya está en uso por otro usuario
 */
router.put('/:id', [authenticateToken, isAdmin], asyncHandler(userController.update));

/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Eliminar usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       204:
 *         description: Usuario eliminado exitosamente
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Acceso denegado - Se requiere rol de administrador
 *       404:
 *         description: Usuario no encontrado
 */
router.delete('/:id', [authenticateToken, isAdmin], asyncHandler(userController.delete));

module.exports = router;

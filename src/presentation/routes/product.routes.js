const { Router } = require('express');
const ProductController = require('../controller/product.controller');

// Esta es la "Inyección de Dependencias" manual
const ProductService = require('../../application/use-cases/product.service');
//const MockProductRepository = require('../../infrastructure/repositories/product.mock.repository');

//const productRepository = new MockProductRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

const router = Router();
router.get('/', productController.getAll);
router.post('/', productController.create);

module.exports = router;
class ProductController {
    constructor(productService) { // Depende del Caso de Uso
        this.productService = productService;
    }
    getAll = async (req, res) => { // Usamos arrow fn para no perder el 'this'
        const products = await this.productService.getAllProducts();
        res.status(200).json(products);
    }
    create = async (req, res) => {
        const product = await this.productService.createProduct(req.body);
        res.status(201).json(product); // 201 Created! 
    }
}
module.exports = ProductController;
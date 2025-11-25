class ProductService {
    constructor(productRepository) { // ¡Depende de la interfaz!
        this.productRepository = productRepository;
    }
    async getAllProducts() {
        return this.productRepository.getAll();
    }
    async createProduct(productData) {
        // Aquí iría la lógica de negocio (validaciones, etc.)
        return this.productRepository.create(productData);
    }
}
module.exports = ProductService;
class MockProductRepository { // ¡Implementa la interfaz!
    constructor() { this.products = ['este es un producto','este es otro producto','tenemos mas productos']; }
    async getAll() { return this.products; }
    async create(productData) {
        const newProduct = { ...productData, id: Date.now() };
        this.products.push(newProduct);
        return newProduct;
    }
}
module.exports = MockProductRepository;
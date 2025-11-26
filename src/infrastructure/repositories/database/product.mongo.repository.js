const ProductModel = require('./models/product.model');
 
class ProductMongoRepository { // ¡Implementa la misma interfaz!
    async getAll() {
        return ProductModel.find();
    }
    async create(productData) {
        return ProductModel.create(productData);
    }
}
module.exports = ProductMongoRepository;
 
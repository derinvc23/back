class Product {
    constructor(id, name, description, price, stock, category, brand, imageUrl) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.category = category;
        this.brand = brand;
        this.imageUrl = imageUrl;
    }
}

module.exports = Product;
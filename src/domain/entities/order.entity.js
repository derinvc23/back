class Order {
    constructor(id, orderNumber, customerName, customerEmail, items, subtotal, totalDiscount, total, status, orderDate) {
        this.id = id;
        this.orderNumber = orderNumber;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.items = items; // Array de { productId, productName, description, quantity, price, discount }
        this.subtotal = subtotal;
        this.totalDiscount = totalDiscount;
        this.total = total;
        this.status = status; // pending, confirmed, shipped, delivered, cancelled
        this.orderDate = orderDate;
    }
}

module.exports = Order;

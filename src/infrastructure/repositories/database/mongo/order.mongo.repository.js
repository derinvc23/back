const OrderRepository = require('../../../../domain/repositories/order.repository.interface');
const OrderModel = require('./models/order.model');
const Order = require('../../../../domain/entities/order.entity');

class OrderMongoRepository extends OrderRepository {
    async getAll() {
        const orders = await OrderModel.find();
        return orders.map(o => new Order(
            o._id.toString(),
            o.orderNumber,
            o.customerName,
            o.customerEmail,
            o.items,
            o.subtotal,
            o.totalDiscount,
            o.total,
            o.status,
            o.orderDate
        ));
    }

    async getById(id) {
        const order = await OrderModel.findById(id);
        if (!order) return null;
        return new Order(
            order._id.toString(),
            order.orderNumber,
            order.customerName,
            order.customerEmail,
            order.items,
            order.subtotal,
            order.totalDiscount,
            order.total,
            order.status,
            order.orderDate
        );
    }

    async create(orderEntity) {
        const newOrder = new OrderModel({
            orderNumber: orderEntity.orderNumber,
            customerName: orderEntity.customerName,
            customerEmail: orderEntity.customerEmail,
            items: orderEntity.items,
            subtotal: orderEntity.subtotal,
            totalDiscount: orderEntity.totalDiscount,
            total: orderEntity.total,
            status: orderEntity.status,
            orderDate: orderEntity.orderDate
        });
        const savedOrder = await newOrder.save();
        return new Order(
            savedOrder._id.toString(),
            savedOrder.orderNumber,
            savedOrder.customerName,
            savedOrder.customerEmail,
            savedOrder.items,
            savedOrder.subtotal,
            savedOrder.totalDiscount,
            savedOrder.total,
            savedOrder.status,
            savedOrder.orderDate
        );
    }

    async update(id, orderEntity) {
        const updatedOrder = await OrderModel.findByIdAndUpdate(id, {
            orderNumber: orderEntity.orderNumber,
            customerName: orderEntity.customerName,
            customerEmail: orderEntity.customerEmail,
            items: orderEntity.items,
            subtotal: orderEntity.subtotal,
            totalDiscount: orderEntity.totalDiscount,
            total: orderEntity.total,
            status: orderEntity.status,
            orderDate: orderEntity.orderDate
        }, { new: true });

        if (!updatedOrder) return null;
        return new Order(
            updatedOrder._id.toString(),
            updatedOrder.orderNumber,
            updatedOrder.customerName,
            updatedOrder.customerEmail,
            updatedOrder.items,
            updatedOrder.subtotal,
            updatedOrder.totalDiscount,
            updatedOrder.total,
            updatedOrder.status,
            updatedOrder.orderDate
        );
    }

    async delete(id) {
        await OrderModel.findByIdAndDelete(id);
    }
}

module.exports = OrderMongoRepository;

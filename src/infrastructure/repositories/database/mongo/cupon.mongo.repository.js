const CuponRepository = require('../../../../domain/repositories/cupon.repository.interface');
const CuponModel = require('./models/cupon.model');
const Cupon = require('../../../../domain/entities/cupon.entity');

class CuponMongoRepository extends CuponRepository {
    async getAll() {
        const cupons = await CuponModel.find();
        return cupons.map(c => new Cupon(
            c._id.toString(),
            c.code,
            c.discountType,
            c.discountValue,
            c.minPurchase,
            c.maxUses,
            c.currentUses,
            c.expirationDate,
            c.isActive
        ));
    }

    async getById(id) {
        const cupon = await CuponModel.findById(id);
        if (!cupon) return null;
        return new Cupon(
            cupon._id.toString(),
            cupon.code,
            cupon.discountType,
            cupon.discountValue,
            cupon.minPurchase,
            cupon.maxUses,
            cupon.currentUses,
            cupon.expirationDate,
            cupon.isActive
        );
    }

    async getByCode(code) {
        const cupon = await CuponModel.findOne({ code: code.toUpperCase() });
        if (!cupon) return null;
        return new Cupon(
            cupon._id.toString(),
            cupon.code,
            cupon.discountType,
            cupon.discountValue,
            cupon.minPurchase,
            cupon.maxUses,
            cupon.currentUses,
            cupon.expirationDate,
            cupon.isActive
        );
    }

    async create(cuponEntity) {
        const newCupon = new CuponModel({
            code: cuponEntity.code,
            discountType: cuponEntity.discountType,
            discountValue: cuponEntity.discountValue,
            minPurchase: cuponEntity.minPurchase,
            maxUses: cuponEntity.maxUses,
            currentUses: cuponEntity.currentUses,
            expirationDate: cuponEntity.expirationDate,
            isActive: cuponEntity.isActive
        });
        const savedCupon = await newCupon.save();
        return new Cupon(
            savedCupon._id.toString(),
            savedCupon.code,
            savedCupon.discountType,
            savedCupon.discountValue,
            savedCupon.minPurchase,
            savedCupon.maxUses,
            savedCupon.currentUses,
            savedCupon.expirationDate,
            savedCupon.isActive
        );
    }

    async update(id, cuponEntity) {
        const updatedCupon = await CuponModel.findByIdAndUpdate(id, {
            code: cuponEntity.code,
            discountType: cuponEntity.discountType,
            discountValue: cuponEntity.discountValue,
            minPurchase: cuponEntity.minPurchase,
            maxUses: cuponEntity.maxUses,
            currentUses: cuponEntity.currentUses,
            expirationDate: cuponEntity.expirationDate,
            isActive: cuponEntity.isActive
        }, { new: true });

        if (!updatedCupon) return null;
        return new Cupon(
            updatedCupon._id.toString(),
            updatedCupon.code,
            updatedCupon.discountType,
            updatedCupon.discountValue,
            updatedCupon.minPurchase,
            updatedCupon.maxUses,
            updatedCupon.currentUses,
            updatedCupon.expirationDate,
            updatedCupon.isActive
        );
    }

    async delete(id) {
        await CuponModel.findByIdAndDelete(id);
    }
}

module.exports = CuponMongoRepository;

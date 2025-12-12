const Cupon = require('../../domain/entities/cupon.entity');
const { NotFoundError, ConflictError, BadRequestError } = require('../../domain/errors');

class CuponService {
    constructor(cuponRepository) {
        this.cuponRepository = cuponRepository;
    }

    async getAllCupons() {
        return this.cuponRepository.getAll();
    }

    async getCuponById(id) {
        const cupon = await this.cuponRepository.getById(id);
        if (!cupon) {
            throw new NotFoundError('Cupon not found');
        }
        return cupon;
    }

    async getCuponByCode(code) {
        const cupon = await this.cuponRepository.getByCode(code);
        if (!cupon) {
            throw new NotFoundError('Cupon not found');
        }
        return cupon;
    }

    async createCupon(cuponData) {
        // Validar que el código no exista
        const existingCupon = await this.cuponRepository.getByCode(cuponData.code);
        if (existingCupon) {
            throw new ConflictError('Cupon code already exists');
        }

        const cuponEntity = new Cupon(
            null,
            cuponData.code,
            cuponData.discountType,
            cuponData.discountValue,
            cuponData.minPurchase || 0,
            cuponData.maxUses || null,
            0, // currentUses siempre empieza en 0
            cuponData.expirationDate || null,
            cuponData.isActive !== undefined ? cuponData.isActive : true
        );
        return this.cuponRepository.create(cuponEntity);
    }

    async updateCupon(id, cuponData) {
        // Verificar que el cupón existe
        const existingCupon = await this.cuponRepository.getById(id);
        if (!existingCupon) {
            throw new NotFoundError('Cupon not found');
        }

        // Si se está actualizando el código, verificar que no exista otro con ese código
        if (cuponData.code && cuponData.code.toUpperCase() !== existingCupon.code) {
            const cuponWithSameCode = await this.cuponRepository.getByCode(cuponData.code);
            if (cuponWithSameCode) {
                throw new ConflictError('Cupon code already exists');
            }
        }

        const cuponEntity = new Cupon(
            id,
            cuponData.code || existingCupon.code,
            cuponData.discountType || existingCupon.discountType,
            cuponData.discountValue !== undefined ? cuponData.discountValue : existingCupon.discountValue,
            cuponData.minPurchase !== undefined ? cuponData.minPurchase : existingCupon.minPurchase,
            cuponData.maxUses !== undefined ? cuponData.maxUses : existingCupon.maxUses,
            cuponData.currentUses !== undefined ? cuponData.currentUses : existingCupon.currentUses,
            cuponData.expirationDate !== undefined ? cuponData.expirationDate : existingCupon.expirationDate,
            cuponData.isActive !== undefined ? cuponData.isActive : existingCupon.isActive
        );
        return this.cuponRepository.update(id, cuponEntity);
    }

    async deleteCupon(id) {
        // Verificar que el cupón existe
        const existingCupon = await this.cuponRepository.getById(id);
        if (!existingCupon) {
            throw new NotFoundError('Cupon not found');
        }
        return this.cuponRepository.delete(id);
    }

    async validateCupon(code) {
        const cupon = await this.cuponRepository.getByCode(code);
        if (!cupon) {
            throw new NotFoundError('Cupon not found');
        }

        // Verificar si está activo
        if (!cupon.isActive) {
            throw new BadRequestError('Cupon is not active');
        }

        // Verificar si está expirado
        if (cupon.expirationDate && new Date(cupon.expirationDate) < new Date()) {
            throw new BadRequestError('Cupon has expired');
        }

        // Verificar si tiene usos disponibles
        if (cupon.maxUses !== null && cupon.currentUses >= cupon.maxUses) {
            throw new BadRequestError('Cupon has reached maximum uses');
        }

        return {
            valid: true,
            cupon: cupon,
            message: 'Cupon is valid'
        };
    }

    async applyCupon(code) {
        // Primero validar el cupón
        const validation = await this.validateCupon(code);

        // Incrementar el uso
        const cupon = validation.cupon;
        const updatedCupon = await this.cuponRepository.update(cupon.id, {
            ...cupon,
            currentUses: cupon.currentUses + 1
        });

        return {
            applied: true,
            cupon: updatedCupon,
            message: 'Cupon applied successfully'
        };
    }
}

module.exports = CuponService;

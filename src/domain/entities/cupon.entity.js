class Cupon {
    constructor(id, code, discountType, discountValue, minPurchase, maxUses, currentUses, expirationDate, isActive) {
        this.id = id;
        this.code = code;                    // Código único del cupón (ej: "DESCUENTO20")
        this.discountType = discountType;    // Tipo: "percentage" o "fixed"
        this.discountValue = discountValue;  // Valor del descuento (20 para 20% o 20 para $20)
        this.minPurchase = minPurchase;      // Compra mínima requerida
        this.maxUses = maxUses;              // Máximo de usos permitidos
        this.currentUses = currentUses;      // Usos actuales
        this.expirationDate = expirationDate; // Fecha de expiración
        this.isActive = isActive;            // Si está activo o no
    }
}

module.exports = Cupon;

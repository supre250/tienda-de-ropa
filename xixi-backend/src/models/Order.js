// ------------------------------------------------------
// Modelo de orden (pedido) generado desde el carrito.
//
// - user: quién hizo la compra
// - items: snapshot de productos y precios al momento de la compra
// - totalAmount: monto total
// - status: estado de la orden (PENDING, PAID, SHIPPED, COMPLETED, CANCELLED)
// - shippingAddress: dirección (puedes adaptarlo a tu necesidad)
// ------------------------------------------------------
const mongoose = require('mongoose');

const { Schema } = mongoose;

const OrderItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: {
      type: String,
      required: true, // guardamos el nombre en el snapshot
    },
    price: {
      type: Number,
      required: true, // precio en el momento de la compra
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'La cantidad mínima es 1'],
    },
  },
  { _id: false }
);

const OrderSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: [OrderItemSchema],
    totalAmount: {
      type: Number,
      required: true,
      min: [0, 'El total no puede ser negativo'],
    },
    status: {
      type: String,
      enum: ['PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELLED'],
      default: 'PENDING',
    },
    shippingAddress: {
      fullName: { type: String },
      addressLine1: { type: String },
      addressLine2: { type: String },
      city: { type: String },
      country: { type: String },
      phone: { type: String },
    },
    paymentMethod: {
      type: String,
      default: 'CASH', // por ahora efectivo / contraentrega
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;

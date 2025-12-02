// ------------------------------------------------------
// Modelo de carrito de compras.
//
// Cada usuario tiene UN carrito:
// - user: referencia al usuario dueño del carrito
// - items: productos con cantidad
// ------------------------------------------------------
const mongoose = require('mongoose');

const { Schema } = mongoose;

const CartItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'La cantidad mínima es 1'],
    },
  },
  { _id: false } // no necesitamos _id interno para cada item
);

const CartSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      unique: true, // un carrito por usuario
      required: true,
    },
    items: [CartItemSchema],
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model('Cart', CartSchema);

module.exports = Cart;

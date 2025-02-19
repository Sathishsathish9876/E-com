const mongoose = require("mongoose");
const validator = require("validator");

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Register",
    required: true,
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
        default: 1,
        validate: {
          validator: (value) => value >= 1,
        },
        message: "quantity must be a grater than 0",
      },
    },
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;

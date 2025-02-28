const express = require("express");
const cartRouter = express.Router();

const {
  getCart,
  addToCart,
  updateCart,
  deleteCart,
  clearCart,
} = require("../controllers/cartController");

// Define cart routes
cartRouter.get("/cart/:id", getCart);
cartRouter.post("/cart", addToCart);
cartRouter.patch("/cart/:id", updateCart);
cartRouter.delete("/cart/:userId/:productId", deleteCart);
cartRouter.delete("/cart/clear/:userId", clearCart);

module.exports = cartRouter;
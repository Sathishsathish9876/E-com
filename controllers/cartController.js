const Cart = require("../models/cartSchema");
const Product = require("../models/productSchema");

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.params.id }).populate(
      "items.product"
    );
    if (!cart) {
      return res
        .status(404)
        .json({ status: "fail", message: "Cart not found" });
    }
    return res.status(200).json({
      status: "success",
      message: "Cart fetched successfully",
      data: cart,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: "Error fetching cart",
      error: err.message,
    });
  }
};

const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ status: "Failed", message: "Product not found" });
    }

    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res
      .status(200)
      .json({
        status: "success",
        message: "Product added to cart successfully",
      });
  } catch (err) {
    res
      .status(500)
      .json({
        status: "Failed",
        message: "Error adding to cart",
        error: err.message,
      });
  }
};

const updateCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res
        .status(404)
        .json({ status: "Failed", message: "Cart not found" });
    }

    const item = cart.items.find(
      (item) => item.product.toString() === productId
    );
    if (!item) {
      return res
        .status(404)
        .json({ status: "Failed", message: "Item not found in cart" });
    }

    item.quantity = quantity;
    await cart.save();

    res
      .status(200)
      .json({ status: "success", message: "Cart updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({
        status: "Failed",
        message: "Error updating cart",
        error: err.message,
      });
  }
};

const deleteCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const cart = await Cart.findOneAndDelete({ user: userId });

    if (!cart) {
      return res
        .status(404)
        .json({ status: "Failed", message: "Cart not found" });
    }

    res
      .status(200)
      .json({ status: "success", message: "Cart deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({
        status: "Failed",
        message: "Error deleting cart",
        error: err.message,
      });
  }
};

const clearCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res
        .status(404)
        .json({ status: "fail", message: "Cart not found" });
    }

    cart.items = [];
    await cart.save();

    res
      .status(200)
      .json({
        status: "success",
        message: "Cart cleared successfully",
        data: cart,
      });
  } catch (err) {
    res
      .status(500)
      .json({
        status: "fail",
        message: "Error clearing cart",
        error: err.message,
      });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCart,
  deleteCart,
  clearCart,
};

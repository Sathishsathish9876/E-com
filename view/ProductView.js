const express = require("express");
const ProductRouter = express.Router();

// IMPORT CONTROLLERS
const {
  getProduct,
  postProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  upload,
} = require("../controllers/productController");
// DEFINE ROUTES
ProductRouter.get("/products", getProduct);
ProductRouter.post("/products", upload, postProduct);
ProductRouter.get("/products/:id", getSingleProduct);
ProductRouter.patch("/products/:id", updateProduct);
ProductRouter.delete("/products/:id", deleteProduct);

module.exports = ProductRouter;
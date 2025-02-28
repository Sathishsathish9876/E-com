// IMPORT REQUIRED MODULES
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const Product = require("../models/productSchema");

// ✅ Ensure "uploads/" folder exists before storing files
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ MULTER STORAGE CONFIGURATION
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Ensure directory exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedExtensions = /jpeg|jpg|png|gif|webp/;
    const extname = allowedExtensions.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedExtensions.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      return cb(
        new Error("Only image files (jpg, jpeg, png, gif, webp) are allowed!")
      );
    }
  },
});

// ✅ GET ALL PRODUCTS
const getProduct = async (req, res) => {
  try {
    const products = await Product.find().populate(
      "reviews.user",
      "firstname email"
    );
    res.status(200).json({
      status: "success",
      message: "Data Fetched Successfully",
      data: products,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Error Fetching Data",
      error: err.message,
    });
  }
};

// ✅ CREATE A NEW PRODUCT WITH IMAGE UPLOAD
const postProduct = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ status: "fail", message: "Image is required!" });
    }

    const newProduct = new Product({
      product: req.body.product,
      description: req.body.description,
      price: req.body.price,
      category: req.body.category,
      image: `/uploads/${req.file.filename}`,
      stock: req.body.stock,
      ratings: req.body.ratings || 0,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json({
      status: "success",
      message: "Product Added Successfully",
      data: savedProduct,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid Product Data",
      error: err.message,
    });
  }
};

// ✅ GET A SINGLE PRODUCT BY ID
const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "reviews.user",
      "firstname email"
    );

    if (!product) {
      return res
        .status(404)
        .json({ status: "fail", message: "Product Not Found" });
    }

    res.status(200).json({
      status: "success",
      message: "Product Fetched Successfully",
      data: product,
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Error Fetching Product",
      error: err.message,
    });
  }
};

// ✅ UPDATE PRODUCT BY ID
const updateProduct = async (req, res) => {
    try {
      console.log("Updating product with ID:", req.params.id); 
  
      if (!req.params.id) {
        return res.status(400).json({
          status: "fail",
          message: "Product ID is required",
        });
      }
  
      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
          status: "fail",
          message: "Request body cannot be empty",
        });
      }
  
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true, 
        runValidators: true, 
      });
  
      if (!product) {
        return res.status(404).json({
          status: "fail",
          message: "Product Not Found",
        });
      }
  
      res.status(200).json({
        status: "success",
        message: "Product Updated Successfully",
        data: product,
      });
  
    } catch (err) {
      console.error("Update error:", err.message); 
      res.status(400).json({
        status: "fail",
        message: "Error Updating Product",
        error: err.message,
      });
    }
  };
  

// ✅ DELETE PRODUCT BY ID
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ status: "fail", message: "Product Not Found" });
    }

    res
      .status(200)
      .json({ status: "success", message: "Product Deleted Successfully" });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: "Error Deleting Product",
      error: err.message,
    });
  }
};

// ✅ EXPORT CONTROLLERS
module.exports = {
  upload: upload.single("image"),
  getProduct,
  postProduct,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};

// ✅ END

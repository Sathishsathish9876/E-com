const mongoose = require("mongoose");
const validator = require("validator");

const productSchema = new mongoose.Schema(
  {
    product: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      validate: {
        validator: (value) => /^[a-zA-Z ]+$/.test(value),
        message: "Only alphabets are allowed",
      },
    },

    description: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value) => validator.isLength(value, { min: 5 }),
        message: "Length must be at least 5 characters",
      },
    },

    price: {
      type: Number,
      required: true,
      trim: true,
      validate: {
        validator: (value) => value > 0,
        message: "Price must be greater than 0",
      },
    },

    category: {
      type: String,
      required: true,
      enum: ["laptop", "desktop", "mobile", "headphone", "watch"],
      message:
        "Category must be one of laptop, mobile, desktop, headphone, watch",
    },

    image: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value) => /\.(png|jpg|jpeg|gif|svg)$/i.test(value),
        message: "Image must be in png, jpg, jpeg, gif, or svg format",
      },
    },

    stock: {
      type: Number,
      required: true,
      trim: true,
      validate: {
        validator: (value) => value >= 0,
        message: "Stock must be greater than or equal to 0",
      },
    },

    rating: {
      type: Number,
      required: true,
      default: 0,
      validate: {
        validator: (value) => value >= 0 && value <= 5,
        message: "Ratings must be between 0 and 5",
      },
    },

    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Register",
        },
        ratings: {
          type: Number,
          required: true,
          default: 0,
          validate: {
            validator: (value) => value >= 0 && value <= 5,
            message: "Ratings must be between 0 and 5",
          },
        },
        comments: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model("Products", productSchema);

module.exports = Product;

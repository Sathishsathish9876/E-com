const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const router = require("./view/RegisterView");
const ProductRouter = require("./view/ProductView");
const CartRouter = require("./view/cartView");
const app = express();
app.use(express.json());
dotenv.config();
app.use(cors());
const port = process.env.PORT || 3300;
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log(error);
  });


  //app router

  app.use('/', router)
  app.use('/', ProductRouter)
  app.use('/', CartRouter)


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

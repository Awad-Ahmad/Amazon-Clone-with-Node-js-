const express = require("express");
const authRouter = require("./auth");
const auth = require("../middleware/auth");

const adminRouter = express.Router();
const { Product } = require("../models/product");
const admin = require("../middleware/admin");
const Order = require("../models/order");
//
adminRouter.post("/add-product", admin, async (req, res) => {
  try {
    const { name, description, quantity, images, category, price } = req.body;
    let product = new Product({
      name,
      description,
      quantity,
      images,
      category,
      price,
    });
    product = await product.save();
    res.status(201).json({
      product: product,
    });
  } catch (error) {
    res.status(500).json({
      messgae: error,
    });
  }
});
adminRouter.get("/", admin, async (req, res) => {
  const product = await Product.find()
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json({
        messgae: error,
      });
    });
});
adminRouter.delete("/:productId", admin, async (req, res) => {
  try {
    console.log(req.params.productId);
    const product = await Product.findByIdAndDelete(req.params.productId);
    res.status(200).json({
      message: "the product has been deleted successfuly",
    });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
});
adminRouter.get("/get-orders", admin, async (req, res) => {
  try {
    console.log(req.user)
    const order = await Order.find({userId: req.user});
    res.status(200).json(order);
    console.log(order);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});
adminRouter.post("/change-order-status", admin, async (req, res) => {
  try {
    const { id, status } = req.body;
    let order = await Order.findById(id);
    order.status = status;
    order = await order.save();
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});
adminRouter.get("/analytics", admin, async (req, res) => {
  try {
    const orders = await Order.find();
    let totalEarning = 0;
    for (let i = 0; orders.length; i++) {
      for (let j = 0; orders[i].product.length; j++) {
        totalEarning +=
          orders[i].product[j].quantity * orders[i].product[j].price;
      }
    }
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
  ///categoy wies order fetching;
  let mobileEarning = await fetchCatWiswProduct("Mobiles");
  let essentialsEarning = await fetchCatWiswProduct("Essentials");

  let appliancesEarning = await fetchCatWiswProduct("Appliances");

  let booksEarning = await fetchCatWiswProduct("Books");

  let fashionEarning = await fetchCatWiswProduct("Fashion");
  let earning = {
    totalEarning,
    mobileEarning,
    essentialsEarning,
    appliancesEarning,
    booksEarning,
    fashionEarning,
  };
  res.json(earning)
});
const fetchCatWiswProduct = async (category) => {
  let earnings = 0;
  let categoryOrders = await Order.find({
    "product.product.category": category,
  });

  for (let i = 0; i < categoryOrders.length; i++) {
    for (let j = 0; j < categoryOrders[i].products.length; j++) {
      earnings +=
        categoryOrders[i].products[j].quantity *
        categoryOrders[i].products[j].product.price;
    }
  }
  return earnings;
};

module.exports = adminRouter;

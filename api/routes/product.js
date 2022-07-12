const express = require("express");
const auth = require("../middleware/auth");
const productRouter = express.Router();
const {Product} = require("../models/product")

productRouter.get("/:categryName", auth, async (req, res) => {
  const product = await Product.find({ category: req.params.categryName })
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
productRouter.get("/search/:searchQuoery", async (req, res) => {
  const product = await Product.find({
    name: { $regex: req.params.searchQuoery, $options: "i" },
  })
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
productRouter.post("/rate-product", auth, async (req, res) => {
  try {
    const { id, rating } = req.body;
    let product = await Product.findById(id);
    console.log(req.user);
    for (let i = 0; i < product.ratings.length; i++) {
      if (product.ratings[i].userId == req.user) {
        product.ratings.splice(i, 1);
        break;
      }
    }
    const ratingSchema = {
      userId: req.user,
      rating,
    };
    product.ratings.push(ratingSchema);
    product = await product.save();
    res.json(product);
  } catch (e) {
    res.status(500).json({
      error: e.messgae,
    });
  }
});
productRouter.get("/deal-of-day", auth, async (req, res) => {
  try {
    let product = await Product.find();
 product=   product.sort((product1,product2)=>{
      let product1Sum=0;
      let product2Sum=0;
    for(let i=0;i<product1.ratings.length;i++)
    {
      product1Sum+=product1.ratings[i]; 
    }
    for(let i=0;i<product2.ratings.length;i++)
    {
     product2Sum+=product2.ratings[i]; 
    }
    return  product1Sum<product2Sum?1:-1;

    });
    res.json(product[0]);
    

  } catch (e) {
    res.status(500).json({ error: e.messgae });
  }
});

module.exports = productRouter;

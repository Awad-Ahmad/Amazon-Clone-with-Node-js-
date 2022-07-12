const express = require("express");
const userRouter = express.Router();
const auth = require("../middleware/auth");
const Order = require("../models/order");
const { Product } = require("../models/product");
const User = require("../models/user");

userRouter.post("/add-to-cart", auth, async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById(id);
    let user = await User.findById(req.user);
    if (user.cart.length == 0) {
      user.cart.push({ product, quanitiy: 1 });
    } else {
      let isProductFound = false;
      for (let i = 0; i < user.cart.length; i++) {
        if (user.cart[i].product._id.equals(product._id)) {
          isProductFound = true;
        }
      }
      if (isProductFound) {
        let newProduct = user.cart.find((theproduct) =>
          theproduct.product._id.equals(product._id)
        );
        newProduct.quanitiy += 1;
      } else {
        user.cart.push({ product, quanitiy: 1 });
      }
    }
    user = await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
});
userRouter.delete("/delete-from-cart/:productId", auth, async (req, res) => {
  try {
    const { id } = req.params.productId;
    const product = await Product.findById(req.params.productId);
    let user = await User.findById(req.user);
    for (let i = 0; i < user.cart.length; i++) {
      if (user.cart[i].product._id.equals(product._id)) {
        if (user.cart[i].quanitiy == 1) {
          user.cart.splice(i, 1);
        } else {
          user.cart[i].quanitiy -= 1;
        }
      }
    }
    user = await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});
userRouter.post("/save-user-address", auth, async (req, res) => {
  try {
    const { address } = req.body;
    let user = await User.findById(req.user);
    user.address = address;
    user = await user.save();
    res.status(200).json(user);
  } catch (err) {
    req.status(500).json({ error: err.message });
  }
});
userRouter.post("/order", auth, async (req, res) => {
  try { 
    const { cart, totalPrice, address } = req.body;
    let products = [];
      for (let i = 0; i < cart.length; i++) {
        let product = await Product.findById(cart[i].product._id);
        if (product.quantity >= cart[i].quanitiy) {
          product.quantity -= cart[i].quanitiy;
          products.push({ product, quantity: cart[i].quanitiy });
          await product.save();
        } else {
          return res
            .status(400)
            .json({ msg: `${product.name} is out of stock!` });
        }
      }
    let user = await User.findById(req.user);
    user.cart = [];
    user = await user.save();
    let order = new Order({
      product:products,
      totalPrice,
      address,
      userId: req.user,
      orderAt: new Date().getTime(),
    });
    order =await order.save();
    res.json(order); 
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
    // try {
    //   const { cart, totalPrice, address } = req.body;
    //   let products = [];
  
    //   for (let i = 0; i < cart.length; i++) {
    //     let product = await Product.findById(cart[i].product._id);
    //     if (product.quantity >= cart[i].quanitiy) {
    //       product.quantity -= cart[i].quanitiy;
    //       products.push({ product, quantity: cart[i].quanitiy });
    //       await product.save();
    //     } else {
    //       return res
    //         .status(400)
    //         .json({ msg: `${product.name} is out of stock!` });
    //     }
    //   }
  
    //   let user = await User.findById(req.user);
    //   user.cart = [];
    //   user = await user.save();
  
    //   let order = new Order({
    //     products,
    //     totalPrice,
    //     address,
    //     userId: req.user,
    //     orderAt: new Date().getTime(),
    //   });
    //   order = await order.save();
    //   res.json(order);
    // } catch (e) {
    //   res.status(500).json({ error: e.message });
    // }
  });
userRouter.get('/get-orders',auth,async(req,res)=>{
  try{
  const  order =await Order.find({userId:req.user});
    res.status(200).json(order);

  }catch(err)
  {
    res.status(500).json({
      error:err.message
    })
  }
})
userRouter.delete('/delete-order/:id',auth,async(req,res)=>{
 const{id}=req.params.id;
 try{
 let order =await Order.findOneAndDelete({_id:req.params.id});
res.status(200).json({
  message:"the item has been deleted"
})
 }catch(err)
 {
  res.status(500).json({error:err.message});
 }

})
module.exports = userRouter;

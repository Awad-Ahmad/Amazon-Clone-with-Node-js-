const mongoose = require("mongoose");
const { productSchema } = require("./product");

const orderSchema =new mongoose.Schema({
  product: [
    {
      product: productSchema,
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  userId:{
    type:String,
    required:true

  },
  orderAt:{
    type:Number,
    required:true
  },
  status:{
    type:Number,
    default:0//// 0: jsut placed 1/ recived 2 delved 3 done
  }
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;

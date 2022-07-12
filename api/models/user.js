const mongoose = require("mongoose");
const { productSchema}  = require("./product");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, //clean all spaces
  },
  email: {
    type: String,
    required: true,

    trim: true, //clean all spaces
    validate: {
      validator: (value) => {
        const re =
          /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
        return value.match(re);
      },
      message: "please eneter a valid email address",
    },
  },
  password: {
    required: true,
    type: String,
    validate: {
      validator: (value) => {
        return value.length > 6;
      },
      message: "please eneter long password",
    },
  },
  address: {
    type: String,
    default: " ",
  },
  type: {
    type: String,
    default: "user",
  },
  cart: [
    {
      product: productSchema,
      quanitiy:{
        type:Number,
        required:true
      }
    },
  ],
});
const User = mongoose.model("User", UserSchema);
module.exports = User;

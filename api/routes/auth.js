const express = require("express");
const auth = require("../middleware/auth");

const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

authRouter.post("/signup", async (req, res) => {
  const { name, email, password,type } = req.body;
  console.log(req.body.name)
  const existingUser = await User.findOne({ email: req.body.email });
  if (existingUser) {
    return res.status(400).json({
      meesage: "User with same already exist email",
    });
  }
  else {
    console.log(password);
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      console.log(err);
      return res.status(500).json({
        error: err,
      });
    } else {
      console.log();
      const user = new User({
        email: req.body.email,
        password: hash,
        name:req.body.name,
        type
      });
      user
        .save()
        .then((result) => {
          console.log(result);
          res.status(201).json({
            message: "Usser created",
          });
        })
        .catch((err) => {
          res.status(500).json({ error: err });
        });
    }
  });
}
});
authRouter.post("/login", async (req, res) => {
  let isUserExist = await User.findOne({ email: req.body.email });
  try {
    if (!isUserExist) {
      console.log(isUserExist.length);
      return res.status(400).json({
        message: "the email is not exist ",
      });
    }
    {
      bcrypt.compare(req.body.password, isUserExist.password, (err, resu) => {
        if (err) {
          return res.status(404).json({
            message: "Auth Faild",
          });
        }
        if (resu) {
          const token = jwt.sign(
            {
              email: isUserExist.email,
              id: isUserExist._id,
              name: isUserExist.name,
            },
            "secret",
            {
              expiresIn: "1000h",
            }
          );
          return res.status(200).json({
            token,
            ...isUserExist._doc,
          });
        }
      });
    }
  } catch (error) {
    console.log(err);
    res.status(500).json({
      error: error,
    });
  }
});
authRouter.post("/tokenIsValid", async (req, res) => {
  try {
    const token = req.header("token");
    if (!token) return res.json(false);
    let isVerfied = jwt.verify(token, "secret");
    if (!isVerfied) return res.json(false);
    const user = await User.findById(isVerfied.id);
    if (!user) return res.json(false);
    res.json(true);
  } catch (error) {
    res.status(500).json({
      error: error,
    });
  }
});
authRouter.get("/", auth, async (req, res, next) => {
  const user = await User.findById(req.user);
  console.log(user.name);
  res.json({ ...user._doc, token: req.token, name: user.name });
});

module.exports = authRouter;

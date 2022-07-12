const jwt = require("jsonwebtoken");
const User=require("../models/user");

const auth = async (req, res, next) => {
  try {
    const token = req.header("token");
    if (!token) {
      return res.status(401).json({
        mesg: "Not auth token, please eneter it ",
      });
    }
    const verify = jwt.verify(token, "secret");
    if (!verify) {
      return res
        .status(401)
        .json({ msg: "Token verification failed, authorization denied." });
    }

    req.user = verify.id;
    
    
    req.token = token;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
module.exports = auth;

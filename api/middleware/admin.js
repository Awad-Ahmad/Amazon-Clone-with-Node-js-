const jwt = require("jsonwebtoken");
const User=require("../models/user");

const admin = async (req, res, next) => 
  {
    try {
      const token = req.header("token");
      console.log(token);
      if (!token)
        return res.status(401).json({ msg: "No auth token, access denied" });
  
      const verified = jwt.verify(token, "secret");
      if (!verified)
        return res
          .status(401)
          .json({ msg: "Token verification failed, authorization denied." });
   const user=await User.findById(verified.id);
   if(user.type=="user"||user.type=='seller')
   {
     res.status(401).json({
      meg:"your are not an admin"
  
     })
   }
  
      req.user = verified.id;
      req.token = token;
  
      next();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };
module.exports=admin;
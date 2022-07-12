const express = require("express");
const authRouter = require("./api/routes/auth");
const adminRouter =require("./api/routes/admin");
const productRouter =require("./api/routes/product");
const userRouter=require('./api/routes/user');
const app = express();
const mongoose=require("mongoose");
const bodyParser=require("body-parser");


const DB=('mongodb+srv://Ahmad_Awad:Ahmadawad0934961515@cluster0.0zqrfsq.mongodb.net/?retryWrites=true&w=majority');
mongoose
  .connect(DB)
  .then(() => {
    console.log("Connection Successful");
  })
  .catch((e) => {
    console.log(e);
  });
mongoose.Promise=global.Promise;
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({extended: false}));
app.use("/user/api",authRouter);  
app.use("/admin/api",adminRouter);  
app.use('/api/products',productRouter);
app.use('/api/user',userRouter)
 
const PORT = 3009;

app.listen(PORT,() => {
  console.log("connected to the port");
});

 
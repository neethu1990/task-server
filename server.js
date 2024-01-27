const express = require( 'express');
const mongoose = require ('mongoose')
const app = express();
const cors = require('cors');
const User = require('./models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const JWT_SECRET= "hghjgdshgfwgbfcwqgfrvgfyf()hj";
const routes = require("./routes/TaskRoutes");

app.use(express.urlencoded({extended:true}));
app.use(cors({
    origin:["http://localhost:3000"]
}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect('mongodb+srv://neethu:neethu234@cluster0.ckjhnyd.mongodb.net/task-manager')
const verifyUser = (req,res,next) => {
    const token = req.cookie.token;
    if(!token) {
        res.json("The token was not available")
    }else {
        jwt.verify(token,"jwt-secret-key",(err,decoded) => {
            if(err) return res.json("token is wrong")
            next();
        })
    }
}



const connection = mongoose.connection;
connection.once('open',() =>{
    console.log('MongoDB connection established successfully');
})


app.post('/signup', async(req,res) => {
    const {username, email, password} = req.body;

    //console.log(password);
    const bpassword= await bcrypt.hash(password,10)
    try{
        const oldUser= await User.findOne({email});
        if(oldUser){
             return res.send({error: "User Exists "}); 
    
        }
        await User.create({username, email, password:bpassword});
        res.send({status:"OK"})
        
    }catch(error) {
        res.send({status:"error"})
    
}})
  
app.post('/signin', async (req,res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if(!user) {
    return res.json({error: " User not found"});
    }

    if(await bcrypt.compare(password, user.password)) {
      const token= jwt.sign({email:user.email}, JWT_SECRET);
      if(res.status(201)){
        return res.json({ status:"OK", data:token});
      }else{
        return res.json({error:"error"});
      }
    }
    res.json({status: "error", error:"Invalid Password"})
      });

app.use("/dashboard", routes);

const PORT = 5001;


app.listen(PORT,() =>{
    console.log(`Server is running on port ${PORT}...`);
})
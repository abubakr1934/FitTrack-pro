const express=require("express");
const cors=require("cors");
const app=express();
const jwt = require("jsonwebtoken");
const User = require("./models/user.model");
const { authenticateToken } = require("../utilities.js")
const config = require("../configuration/config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);
app.use(
    cors({
        origin:"*",
    })
)
app.post("/signup",async (req,res)=>{
    const {fullname,email,password,confirmPassword}=req.body;
    if(!fullname || !email){
        return res.status(400).json({
            error:true,
            message:"enter full name and email",
        })
    }
    if(password!==confirmPassword){
        return res.status(400).json({
            error:true,
            message:"passwords not matching",
        })
    }
    const isUser=await User.findOne({email:email})//email as the differentiating key
    if(isUser){
        //exists already
        return res.status(200).json({
            error:true,
            message:"User already exists"
        })
    }
    else{
        const newUser=new User({
            fullname,
            email,
            password
        })//mew user created with the given details and remaining will be put default as in the model schema
        await newUser.save();
        const accessToken = jwt.sign({ newUser }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "36000m",
        });//generated access token for the user
        return res.status(200).json({
            newUser,
            accessToken,
            message:"Registration was successfull"
        })
        
    }
    
})
app.listen(8000);
module.exports=app;
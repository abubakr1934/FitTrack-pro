require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Exercise = require("../models/calorieBurnt.model");
const CalorieIntake = require("../models/calorieIntake.model");
const { authenticateToken } = require("../utilities.js");
const config = require("../configuration/config.json");
const mongoose = require("mongoose");
const { access } = require("fs");
mongoose.connect(config.connectionString);
const ACCESS_TOKEN_SECRET =
  "bff01826f614cc3eb42faf5e1812a984d2eabe53d3b60f007dd743a2bb478e6c264ac28859f4b0b8a9527363826f2e35e0db8e6292e76b9c960aa8135f957ca9";
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);


app.post("/signup", async (req, res) => {
  const { fullname, email, password, confirmPassword } = req.body;
  if (!fullname || !email) {
    return res.status(400).json({
      error: true,
      message: "enter full name and email",
    });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({
      error: true,
      message: "passwords not matching",
    });
  }
  const isUser = await User.findOne({ email: email }); //email as the differentiating key
  if (isUser) {
    //exists already
    return res.status(200).json({
      error: true,
      message: "User already exists",
    });
  } else {
    const newUser = new User({
      fullname,
      email,
      password,
    }); //new user created with the given details and remaining will be put default as in the model schema
    await newUser.save();
    const accessToken = jwt.sign({ newUser }, ACCESS_TOKEN_SECRET, {
      expiresIn: "36000m",
    }); //generated access token for the user
    console.log(newUser);
    return res.status(200).json({
      newUser,
      accessToken,
      message: "Registration was successfull",
    });
  }
});



app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({
      error: true,
      message: "Please enter your email",
    });
  }
  if (!password) {
    return res.status(400).json({
      error: true,
      message: "Please enter your password",
    });
  }

  try {
    const isUser = await User.findOne({ email: email });
    if (!isUser) {
      return res.status(400).json({
        error: true,
        message: "User does not exist, please sign up",
      });
    }

    if (isUser.password === password) {
      const userPayload = { user: isUser };
      const accessToken = jwt.sign(userPayload, ACCESS_TOKEN_SECRET, {
        expiresIn: "36000m",
      });
      console.log(accessToken);
      return res.json({
        error: false,
        message: "Login Successful",
        email,
        accessToken,
      });
    } else {
      return res.status(400).json({
        error: true,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "An error occurred during login",
      details: error.message,
    });
  }
});



app.post("/addExercise", authenticateToken, async (req, res) => {
  const { exercises, totalCaloriesBurned } = req.body;
  const { user } = req.user;

  if (!exercises) {
    return res.json({
      error: true,
      message: "Add exercise before pressing enter",
    });
  }

  try {
    const newExercise = new Exercise({
      user: user._id,
      exercises: exercises,
      totalCaloriesBurned: totalCaloriesBurned,
    });

    await newExercise.save();
    return res.status(200).json({
      error: false,
      newExercise,
      message: "Exercise added successfully",
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: "An error occurred while adding the exercise",
      details: err.message,
    });
  }
});



//edit exercise updated
app.put("/editExercise/:exerciseId", authenticateToken, async (req, res) => {
    const { exerciseId } = req.params;
    const { user } = req.user;
    const { exercises, date, totalCaloriesBurned } = req.body;
  
    try {
      const exc = await Exercise.findOne({ user: user._id, _id: exerciseId });
  
      if (!exc) {
        return res.status(400).json({
          error: true,
          message: "No exercise found",
        });
      }
      if (exercises) exc.exercises = exercises;
      if (date) exc.date = date;
      if (totalCaloriesBurned) exc.totalCaloriesBurned = totalCaloriesBurned;
      await exc.save();
  
      return res.json({
        error: false,
        exc,
        message: "Exercise details updated successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        error: true,
        message: "Internal server error",
      });
    }
  });



//delete exercise
app.delete("/deleteExercise/:exerciseId",authenticateToken,async(req,res)=>{
  const {user}=req.user;
  const exerciseId=req.params.exerciseId;

  if(!exerciseId){
    return res.json({
      error:true,
      message:"enter the exercise id to delete"
    })
  }
  try{
    const exc=await Exercise.findOne({user: user._id, _id: exerciseId})
    if(!exc){
      return res.json({
        error:true,
        message:"no exercise found"
      })
    }
    await Exercise.deleteOne({user: user._id, _id: exerciseId})
    return res.status(200).json({
      error:false,
      message:"exercise deleted successfully"
    })
  }
  catch(error){
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
})


//add food api
app.post("/addCalorieIntake", authenticateToken, async (req, res) => {
  const { foodItems } = req.body;
  const { user } = req.user;
  if (!foodItems || foodItems.length === 0) {
    return res.status(400).json({
      error: true,
      message: "Please add at least one food item",
    });
  }

  try {

    const newCalorieIntake = new CalorieIntake({
      user: user._id,
      foodItems: foodItems,
    });


    await newCalorieIntake.save();


    return res.status(200).json({
      error: false,
      newCalorieIntake,
      message: "Calorie intake added successfully",
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: "An error occurred while adding calorie intake",
      details: err.message,
    });
  }
});
app.put("/update-user", authenticateToken, async (req, res) => {
  const {user} = req.user;
  const { fullname, profile } = req.body;

  if (!fullname && !profile) {
    return res.json({
      error: true,
      message: "Enter your name and other profiles properly"
    });
  }

  try {
    console.log(user._id);
    const nUser = await User.findOne({ _id: user._id });

    if (!nUser) {
      return res.json({
        error: true,
        message: "User not found"
      });
    }
    if (fullname) nUser.fullname = fullname;
    if (profile) nUser.profile = { ...nUser.profile, ...profile };

    await nUser.save();

    return res.status(200).json({
      error: false,
      message: "Profile updated successfully"
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal error occurred"
    });
  }
});



//get user
app.get("/get-user", authenticateToken, async (req, res) => {
  const { user } = req.user;

  const isUser = await User.findOne({ _id: user._id });

  if (!isUser) {
    return res.sendStatus(401);
  }

  return res.json({
    user: isUser,
    message: "",
  });
});
app.listen(8000, () => {
  console.log("server is running at port 8000");
});
module.exports = app;

require("dotenv").config();
const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const apiKey = "AIzaSyC9bRubY0YXF3fDkAHjfIbOquoLeTfhf6k";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});
const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};
const https = require("https");
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Exercise = require("../models/calorieBurnt.model");
const CalorieIntake = require("../models/calorieIntake.model");
const dietPlan = require("../models/dietPlan.model");
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
    // console.log(newUser);
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
      // console.log(accessToken);
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
app.post('/logout', (req, res) => {

  return res.json({ message: 'Logout successful' });
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
app.delete(
  "/deleteExercise/:exerciseId",
  authenticateToken,
  async (req, res) => {
    const { user } = req.user;
    const exerciseId = req.params.exerciseId;

    if (!exerciseId) {
      return res.json({
        error: true,
        message: "enter the exercise id to delete",
      });
    }
    try {
      const exc = await Exercise.findOne({ user: user._id, _id: exerciseId });
      if (!exc) {
        return res.json({
          error: true,
          message: "no exercise found",
        });
      }
      await Exercise.deleteOne({ user: user._id, _id: exerciseId });
      return res.status(200).json({
        error: false,
        message: "exercise deleted successfully",
      });
    } catch (error) {
      return res.status(500).json({
        error: true,
        message: "Internal Server Error",
      });
    }
  }
);

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

// update calorieIntake
app.put(
  "/updateCalorieIntake/:calorieIntakeId",
  authenticateToken,
  async (req, res) => {
    const { calorieIntakeId } = req.params;
    const { user } = req.user;
    const { foodItems } = req.body;

    if (!foodItems || foodItems.length === 0) {
      return res.status(400).json({
        error: true,
        message: "Please add at least one food item to update",
      });
    }

    try {
      const calorieIntake = await CalorieIntake.findOne({
        _id: calorieIntakeId,
        user: user._id,
      });

      if (!calorieIntake) {
        return res.status(404).json({
          error: true,
          message: "Calorie intake record not found",
        });
      }

      calorieIntake.foodItems = foodItems;

      await calorieIntake.save();

      return res.status(200).json({
        error: false,
        calorieIntake,
        message: "Calorie intake updated successfully",
      });
    } catch (err) {
      return res.status(500).json({
        error: true,
        message: "An error occurred while updating calorie intake",
        details: err.message,
      });
    }
  }
);

// delete calorie intake
app.delete(
  "/deleteCalorieIntake/:calorieIntakeId",
  authenticateToken,
  async (req, res) => {
    const { calorieIntakeId } = req.params;
    const { user } = req.user;

    try {
      const deletedCalorieIntake = await CalorieIntake.findOneAndDelete({
        _id: calorieIntakeId,
        user: user._id,
      });

      if (!deletedCalorieIntake) {
        return res.status(404).json({
          error: true,
          message:
            "Calorie intake record not found or you don't have permission to delete this record",
        });
      }

      return res.status(200).json({
        error: false,
        message: "Calorie intake record deleted successfully",
        deletedCalorieIntake,
      });
    } catch (err) {
      return res.status(500).json({
        error: true,
        message: "An error occurred while deleting the calorie intake record",
        details: err.message,
      });
    }
  }
);
//all exercises
app.get("/getAllExercises", authenticateToken, async (req, res) => {
  const { user } = req.user;
  if (!user) {
    return res.json({
      error: true,
      message: "user not found",
    });
  }
  try {
    const excs = await Exercise.find({ user: user._id });
    if (!excs) {
      return res.json({
        error: true,
        message: "exercises not found",
      });
    }
    return res.status(200).json({
      error: true,
      excs,
      message: "exercises returned successfully",
    });
  } catch (error) {
    return res.json({
      error: true,
      message: "Internal error occured",
    });
  }
});

//all food items
app.get("/getAllFoodItems", authenticateToken, async (req, res) => {
  const { user } = req.user;
  if (!user) {
    return res.json({
      error: true,
      message: "user not found",
    });
  }
  try {
    const food = await CalorieIntake.find({ user: user._id });
    if (!food) {
      return res.json({
        error: true,
        message: "exercises not found",
      });
    }
    return res.status(200).json({
      error: true,
      food,
      message: "food items returned successfully",
    });
  } catch (error) {
    return res.json({
      error: true,
      message: "Internal error occured",
    });
  }
});

//update user profile
app.put("/update-user", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const { fullname, profile } = req.body;

  if (!fullname && !profile) {
    return res.json({
      error: true,
      message: "Enter your name and other profiles properly",
    });
  }

  try {
    console.log(user._id);
    const nUser = await User.findOne({ _id: user._id });

    if (!nUser) {
      return res.json({
        error: true,
        message: "User not found",
      });
    }
    if (fullname) nUser.fullname = fullname;
    if (profile) nUser.profile = { ...nUser.profile, ...profile };

    await nUser.save();

    return res.status(200).json({
      error: false,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: true,
      message: "Internal error occurred",
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

//generate personalised diet plan and store it in the respective model
app.post("/generate-diet-plan", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const { weight, goal, height, dietPreference, mealsPerDay, otherDetails } =
    req.body;
  const userId = user._id;

  // Validate required fields
  if (
    !weight ||
    !goal ||
    !height ||
    !dietPreference ||
    !mealsPerDay ||
    !otherDetails
  ) {
    return res.status(400).json({
      error: true,
      message:
        "Please provide all required fields: weight, goal, height, dietPreference, mealsPerDay, and otherDetails",
    });
  }

  // Ensure userId is defined
  if (!userId) {
    return res.status(400).json({
      error: true,
      message: "User ID is missing or undefined",
    });
  }

  // Construct the prompt
  const prompt = `
    Create a diet plan for a person with the following details:
    - Current weight: ${weight} kg
    - Height: ${height} cm
    - Goal: ${goal} (e.g., lose weight, gain muscle, maintain weight)
    - Diet preference: ${dietPreference} (vegetarian or non-vegetarian)
    - Meals per day: ${mealsPerDay}
    ${otherDetails ? `- Other details: ${otherDetails}` : ""}
    
    The diet plan should include meal names, food items, and the nutritional value for each meal (fat, protein, carbs, calories). Format the response as JSON with the following structure:
    {
      "diet_plan": {
        "meals": [
          {
            "mealName": "Meal Name",
            "foodItems": ["Food Item 1", "Food Item 2"],
            "nutritionalValue": {
              "fat": "Fat in grams",
              "protein": "Protein in grams",
              "carbs": "Carbs in grams",
              "calories": Calories in kcal
            }
          }
        ]
      }
    }
  `;

  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(prompt);
    // console.log("Raw Response:", result.response.text());

    // Extract the JSON part from the response
    const jsonStart = result.response.text().indexOf("{");
    const jsonEnd = result.response.text().lastIndexOf("}");
    const jsonResponse = result.response
      .text()
      .substring(jsonStart, jsonEnd + 1);

    let dietPlanResponse;
    try {
      dietPlanResponse = JSON.parse(jsonResponse);
    } catch (error) {
      return res.status(400).json({
        error: true,
        message:
          "Error parsing diet plan response. Response was: " + jsonResponse,
      });
    }

    // Validate the structure of the response
    if (!dietPlanResponse.diet_plan || !dietPlanResponse.diet_plan.meals) {
      return res.status(400).json({
        error: true,
        message:
          "Invalid diet plan response structure. Response was: " + jsonResponse,
      });
    }

    // Clean up the calories field to remove "kcal" and convert to number
    dietPlanResponse.diet_plan.meals.forEach((meal) => {
      meal.nutritionalValue.calories = parseFloat(
        meal.nutritionalValue.calories.replace("kcal", "").trim()
      );
    });

    // Create a new diet plan document
    const dietPlanNew = new dietPlan({
      user: userId,
      goal,
      dietPreference,
      mealsPerDay,
      meals: dietPlanResponse.diet_plan.meals,
    });

    // Log the diet plan before saving to ensure user field is set
    console.log("Diet Plan to be saved:", dietPlanNew);

    // Save the diet plan to the database
    await dietPlanNew.save();

    return res.status(200).json({
      error: false,
      message: "Diet plan generated and saved successfully",
      dietPlan: dietPlanNew,
    });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return res.status(500).json({
      error: true,
      message: "Some internal error occurred",
    });
  }
});

//retrieve diet plan
app.get("/get-diet-plan", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const userId = user._id;

  if (!userId) {
    return res.status(404).json({
      error: true,
      message: "User not found",
    });
  }

  try {
    const dietPlanDoc = await dietPlan.findOne({ user: userId });
    if (!dietPlanDoc) {
      return res.status(404).json({
        error: true,
        message: "No diet plan initialized",
      });
    }

    await dietPlanDoc.deleteOne();
    return res.status(200).json({
      error: false,
      message: "Plan deleted successfully",
    });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return res.status(500).json({
      error: true,
      message: "Internal error occurred",
      error: error.message,
    });
  }
});

//exercise data retrieval from rapid api


app.post("/getExerciseDataRapidApi", async (req, res) => {
  const { exercise } = req.body;
  if (!exercise) {
    return res.status(400).json({
      error: true,
      message: "Please enter the exercise name",
    });
  }

  try {
    const options = {
      method: "GET",
      hostname: "calories-burned-by-api-ninjas.p.rapidapi.com",
      port: null,
      path: `/v1/caloriesburned?activity=${encodeURIComponent(exercise)}`,
      headers: {
        "x-rapidapi-key": "54e2824a09mshb91e1652b8ff92dp112556jsned82753eaa1e",
        "x-rapidapi-host": "calories-burned-by-api-ninjas.p.rapidapi.com",
      },
    };

    const apiReq = https.request(options, function (apiRes) {
      const chunks = [];

      apiRes.on("data", function (chunk) {
        chunks.push(chunk);
      });

      apiRes.on("end", function () {
        const body = Buffer.concat(chunks).toString();
        try {
          const parsedBody = JSON.parse(body);
          res.json(parsedBody); // Respond with the data received from RapidAPI
        } catch (parseError) {
          res.status(500).json({ error: "Error parsing data from RapidAPI" });
        }
      });
    });

    apiReq.on("error", (e) => {
      res.status(500).json({ error: "Error fetching data from RapidAPI" });
    });

    apiReq.end();
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Some internal error occurred",
      errorMessage: error.message,
    });
  }
});
app.listen(8000, () => {
  console.log("server is running at port 8000");
});
module.exports = app;

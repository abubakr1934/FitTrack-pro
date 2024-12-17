require("dotenv").config();
const express = require("express");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const apiKey = "AIzaSyA6DJeI4XnMBXX7hvJ1kpKp58QdLGQpoRc";
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
const exercisePlan=require("../models/exercisePlan.model");
const Exercise = require("../models/calorieBurnt.model");
const CalorieIntake = require("../models/calorieIntake.model");
const dietPlan = require("../models/dietPlan.model");
const ExercisePlan=require("../models/exercisePlan.model");
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
    }); 
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

const axios = require('axios');

app.post("/addExercise", authenticateToken, async (req, res) => {
  const { exerciseName, muscleGroup, duration } = req.body;
  const { user } = req.user;

  if (!exerciseName || !muscleGroup || !duration) {
    return res.json({
      error: true,
      message: "Exercise name, muscle group, and duration are required",
    });
  }

  try {
    const nutritionixResponse = await axios.post('https://trackapi.nutritionix.com/v2/natural/exercise', {
      query: `${exerciseName} for ${duration} minutes`,
      gender: user.profile.gender, 
      weight_kg: user.profile.weight, 
      height_cm: user.profile.height, 
      age: user.profile.age, 
    }, {
      headers: {
        'x-app-id': '7ef74ae8',
        'x-app-key': '78bc93c3e71b061e7acf5f1cfca5f3e1', 
        'Content-Type': 'application/json',
      },
    });
    console.log(nutritionixResponse.data.exercises);
    const caloriesBurned = nutritionixResponse.data.exercises[0].nf_calories;
    const newExercise = new Exercise({
      user: user._id,
      exercises: [{ exerciseName, muscleGroup, duration, caloriesBurned }],
      totalCaloriesBurned: caloriesBurned,
    });

    console.log("Exercise Document to be Saved:", newExercise);
    await newExercise.save();
    console.log("Exercise Saved Successfully");

    return res.status(200).json({
      error: false,
      newExercise,
      message: "Exercise added successfully",
    });
  } catch (err) {
    console.error("Error Occurred:", err);
    return res.status(500).json({
      error: true,
      message: "An error occurred while adding the exercise",
      details: err.message,
    });
  }
});

// Edit exercise


// Delete exercise
app.delete("/deleteExercise/:exerciseId", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const exerciseId = req.params.exerciseId;

  if (!exerciseId) {
    return res.json({
      error: true,
      message: "Enter the exercise id to delete",
    });
  }

  try {
    const exc = await Exercise.findOne({ user: user._id, _id: exerciseId });
    if (!exc) {
      return res.json({
        error: true,
        message: "No exercise found",
      });
    }

    await Exercise.deleteOne({ user: user._id, _id: exerciseId });
    return res.status(200).json({
      error: false,
      message: "Exercise deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

app.get('/getExercisesForToday', authenticateToken, async (req, res) => {
  const { user } = req.user;
  const today = new Date().toISOString().split('T')[0]; 

  try {
    const exercises = await Exercise.find({
      user: user._id,
      date: {
        $gte: new Date(today), 
        $lte: new Date(new Date(today).getTime() + 24 * 60 * 60 * 1000) 
      }
    });

    return res.status(200).json({
      error: false,
      exercises,
      message: 'Exercises for today retrieved successfully',
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'An error occurred while retrieving exercises for today',
      details: error.message,
    });
  }
});


app.post("/addCalorieIntake", authenticateToken, async (req, res) => {
  const { foodName, quantity } = req.body;
  const { user } = req.user;

  if (!foodName || !quantity) {
    return res.status(400).json({
      error: true,
      message: "Please provide all required fields: foodName and quantity",
    });
  }

  try {
    const nutritionixResponse = await axios.post('https://trackapi.nutritionix.com/v2/natural/nutrients', {
      query: `${quantity} ${foodName}`,
    }, {
      headers: {
        'x-app-id': '7ef74ae8', 
        'x-app-key': '78bc93c3e71b061e7acf5f1cfca5f3e1',
        'Content-Type': 'application/json',
      },
    });

    const foodItems = nutritionixResponse.data.foods;
    if (!foodItems || foodItems.length === 0) {
      return res.status(400).json({
        error: true,
        message: "Unable to fetch nutritional data for the provided food item",
      });
    }

    const foodItem = foodItems[0];
    const { nf_calories, nf_total_fat, nf_protein, nf_total_carbohydrate } = foodItem;

    const newCalorieIntake = new CalorieIntake({
      user: user._id,
      foodName,
      quantity,
      fat: nf_total_fat,
      protein: nf_protein,
      carbs: nf_total_carbohydrate,
      calories: nf_calories,
    });

    await newCalorieIntake.save();

    return res.status(200).json({
      error: false,
      newCalorieIntake,
      message: "Calorie intake added successfully",
    });
  } catch (err) {
    console.error("Error Occurred:", err);
    return res.status(500).json({
      error: true,
      message: "An error occurred while adding calorie intake",
      details: err.message,
    });
  }
});


// Delete Calorie Intake
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
          message: "Calorie intake record not found or you don't have permission to delete this record",
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

app.get('/getFoodEntriesForToday', authenticateToken, async (req, res) => {
  const { user } = req.user;
  const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

  try {
    const foodEntries = await CalorieIntake.find({
      user: user._id,
      date: {
        $gte: new Date(today), // Greater than or equal to today's date at 00:00:00
        $lt: new Date(new Date(today).getTime() + 24 * 60 * 60 * 1000) // Less than tomorrow's date at 00:00:00
      }
    });

    return res.status(200).json({
      error: false,
      foodEntries,
      message: 'Food entries for today retrieved successfully',
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'An error occurred while retrieving food entries for today',
      details: error.message,
    });
  }
});
app.get('/getAllFoodEntries', authenticateToken, async (req, res) => {
  const { user } = req.user;
  const { timeFrame } = req.query;

  let startDate, endDate;

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today

  switch (timeFrame) {
    case 'today':
      startDate = new Date(today);
      endDate = new Date(today.getTime() + 24 * 60 * 60 * 1000); // End of today
      break;
    case 'yesterday':
      startDate = new Date(today.getTime() - 24 * 60 * 60 * 1000); // Start of yesterday
      endDate = new Date(today); // End of yesterday
      break;
    case 'past5days':
      startDate = new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000); // Start of 5 days ago
      endDate = new Date(today.getTime() + 24 * 60 * 60 * 1000); // End of today
      break;
    default:
      return res.status(400).json({
        error: true,
        message: 'Invalid time frame',
      });
  }

  try {
    const foodEntries = await CalorieIntake.find({
      user: user._id,
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    return res.status(200).json({
      error: false,
      foodEntries,
      message: 'Food entries retrieved successfully',
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: 'An error occurred while retrieving food entries',
      details: error.message,
    });
  }
});
app.get("/getAll", authenticateToken, async (req, res) => {
  const {user} = req.user;

  console.log('Incoming request for getAllExercises');
  console.log('Request user:', user);

  if (!user) {
    return res.json({
      error: true,
      message: "User not found",
    });
  }

  try {
    // Fetch all exercises for the user without any date filtering
    const exercises = await Exercise.find({ user: user._id });

    console.log('Found exercises:', exercises);

    if (!exercises || exercises.length === 0) {
      return res.json({
        error: true,
        message: "No exercises found.",
      });
    }

    return res.status(200).json({
      error: false,
      exercises,
      message: "Exercises returned successfully",
    });
  } catch (error) {
    console.error('Error in getAllExercises:', error);
    return res.status(500).json({
      error: true,
      message: "Internal error occurred",
    });
  }
});

//all exercises
app.get("/getAllExercises", authenticateToken, async (req, res) => {
  const {user} = req.user;
  const { timeFrame } = req.query;

  console.log('Incoming request for getAllExercises');
  console.log('Request user:', user);
  console.log('Requested timeFrame:', timeFrame);

  if (!user) {
    return res.json({
      error: true,
      message: "User not found",
    });
  }

  try {
    let startDate, endDate;
    const now = new Date();

    switch (timeFrame) {
      case 'today':
        console.log('today')
        startDate = new Date(now);
        startDate.setHours(0, 0, 0, 0); // Start of the current day
        endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999); // End of the current day
        break;
      case 'yesterday':
        console.log('yesterday')
        endDate = new Date(now);
        endDate.setHours(0, 0, 0, 0); // Start of today
        startDate = new Date(endDate);
        startDate.setDate(startDate.getDate() - 1); // Start of yesterday
        break;
      case 'past5days':
        console.log('5 din pehle')
        endDate = new Date(now);
        endDate.setHours(23, 59, 59, 999); // End of the current day
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 5); // Start of 5 days ago
        startDate.setHours(0, 0, 0, 0); // Start of that day
        break;
      default:
        startDate = new Date(0); // Start of Unix epoch
        endDate = new Date(); // Current date and time
    }

    console.log('Date range:', { startDate, endDate });

    const exercises = await Exercise.find({
      user: user._id,
      date: { $gte: startDate, $lte: endDate },
    });

    console.log('Found exercises:', exercises);

    if (!exercises || exercises.length === 0) {
      return res.json({
        error: true,
        message: "No exercises found for the specified timeframe.",
      });
    }

    return res.status(200).json({
      error: false,
      exercises,
      message: "Exercises returned successfully",
    });
  } catch (error) {
    console.error('Error in getAllExercises:', error);
    return res.status(500).json({
      error: true,
      message: "Internal error occurred",
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
  const { weight, goal, height, dietPreference, mealsPerDay, otherDetails, ageGroup, healthConditions } = req.body;
  const userId = user._id;

  // Validate required fields
  if (
    !weight ||
    !goal ||
    !height ||
    !dietPreference ||
    !mealsPerDay ||
    !otherDetails ||
    !ageGroup ||
    !healthConditions
  ) {
    return res.status(400).json({
      error: true,
      message:
        "Please provide all required fields: weight, goal, height, dietPreference, mealsPerDay, otherDetails, ageGroup, and healthConditions",
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
    - Age group: ${ageGroup}
    - Health conditions: ${healthConditions}
    - Goal: ${goal} (e.g., lose weight, gain muscle, maintain weight)
    - Diet preference: ${dietPreference} (vegetarian or non-vegetarian)
    - Meals per day: ${mealsPerDay}
    ${otherDetails ? `- Other details: ${otherDetails}` : ""}
    
    The diet plan should include meal names, food items, and the nutritional value for each meal (fat, protein, carbs, calories). Additionally, provide insights about the plan, including a timeline for achieving the goal. The timeline should be divided into three timeframes: first 4 weeks, next 4 weeks, and the final 4 weeks. For each timeframe, provide only the expected numerical weight loss or gain in kilograms. Format the response as JSON with the following structure:
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
      },
      "insights": {
        "timeline": {
          "first_4_weeks": "Expected weight loss or gain in kilograms (e.g., 1-2 kg loss)",
          "next_4_weeks": "Expected weight loss or gain in kilograms (e.g., 2-3 kg loss)",
          "final_4_weeks": "Expected weight loss or gain in kilograms (e.g., 3-4 kg loss)"
        }
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
    if (!dietPlanResponse.diet_plan || !dietPlanResponse.diet_plan.meals || !dietPlanResponse.insights || !dietPlanResponse.insights.timeline) {
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
      ageGroup,
      healthConditions,
    });

    // Log the diet plan before saving to ensure user field is set
    console.log("Diet Plan to be saved:", dietPlanNew);

    // Save the diet plan to the database
    await dietPlanNew.save();

    return res.status(200).json({
      error: false,
      message: "Diet plan generated and saved successfully",
      dietPlan: dietPlanNew,
      timeline: dietPlanResponse.insights.timeline,
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

    return res.status(200).json({
      error: false,
      message: "Diet plan retrieved successfully",
      dietPlan: dietPlanDoc,
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

// Delete diet plan
app.delete("/delete-diet-plan", authenticateToken, async (req, res) => {
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

app.listen(8000, () => {
  console.log("server is running at port 8000");
});
app.put('/updateUserGoals', authenticateToken, async (req, res) => {
  const { user } = req.user;
  const { calorieIntakeGoal, calorieBurntGoal } = req.body;

  console.log('Request Body:', req.body); // Debugging line

  // Validate required fields
  
  try {
    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      {
        $set: {
          'profile.calorieIntakeGoal': calorieIntakeGoal,
          'profile.calorieBurntGoal': calorieBurntGoal,
        },
      },
      { new: true } // Return the updated document
    );

    if (!updatedUser) {
      console.error('User not found'); // Debugging line
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    console.log('User goals updated successfully:', updatedUser); // Debugging line
    return res.status(200).json({
      error: false,
      message: "User goals updated successfully",
      user: updatedUser,
    });
  } catch (err) {
    console.error('Error updating user goals:', err); // Debugging line
    return res.status(500).json({
      error: true,
      message: "An error occurred while updating user goals",
      details: err.message,
    });
  }
});
app.get('/getUserGoals', authenticateToken, async (req, res) => {
  const { user } = req.user;

  try {
    const userDoc = await User.findById(user._id);

    if (!userDoc) {
      return res.status(404).json({
        error: true,
        message: "User not found",
      });
    }

    return res.status(200).json({
      error: false,
      message: "User goals retrieved successfully",
      user: userDoc,
    });
  } catch (err) {
    return res.status(500).json({
      error: true,
      message: "An error occurred while retrieving user goals",
      details: err.message,
    });
  }
});
app.get('/getCalorieIntakeForToday', authenticateToken, async (req, res) => {
  const { user } = req.user;

  if (!user) {
    return res.status(404).json({
      error: true,
      message: "User not found",
    });
  }

  console.log('Incoming request for getCalorieIntakeForToday');
  const today = new Date();
  const startDate = new Date(today.setHours(0, 0, 0, 0)); // Start of today's date
  const endDate = new Date(today.setHours(23, 59, 59, 999)); // End of today's date
  console.log('Date range:', { startDate, endDate });

  try {
    const userDoc = await User.findById(user._id);
    if (!userDoc) {
      console.log("User not found");
      return res.status(404).json({ error: true, message: "User not found" });
    }

    const calorieIntakeGoal = userDoc.profile.calorieIntakeGoal;
    console.log("Calorie Intake Goal:", calorieIntakeGoal);

    const calorieIntakes = await CalorieIntake.find({
      user: user._id,
      date: { $gte: startDate, $lte: endDate },
    });

    console.log('Found calorie intakes:', calorieIntakes);

    const totalCalories = calorieIntakes.reduce((sum, intake) => sum + intake.calories, 0);

    return res.status(200).json({
      calorieIntakeGoal,
      calorieIntakeConsumed: totalCalories,
      message: "Calorie intake for today retrieved successfully",
    });
  } catch (err) {
    console.error('Error fetching calorie intake for today:', err);
    return res.status(500).json({
      error: true,
      message: "An error occurred while fetching calorie intake for today",
      details: err.message,
    });
  }
});

app.get('/getCalorieBurntForToday', authenticateToken, async (req, res) => {
  const { user } = req.user;

  if (!user) {
    return res.status(404).json({
      error: true,
      message: "User not found",
    });
  }

  console.log('Incoming request for getCalorieBurntForToday');
  const today = new Date();
  const startDate = new Date(today.setHours(0, 0, 0, 0)); // Start of today's date
  const endDate = new Date(today.setHours(23, 59, 59, 999)); // End of today's date
  console.log('Date range:', { startDate, endDate });

  try {
    const userDoc = await User.findById(user._id);
    if (!userDoc) {
      console.log("User not found");
      return res.status(404).json({ error: true, message: "User not found" });
    }

    const calorieBurntGoal = userDoc.profile.calorieBurntGoal;
    console.log("Calorie Burnt Goal:", calorieBurntGoal);

    const exercises = await Exercise.find({
      user: user._id,
      date: { $gte: startDate, $lte: endDate },
    });

    console.log('Found exercises:', exercises);

    const totalCaloriesBurned = exercises.reduce((sum, exercise) => {
      return sum + exercise.exercises.reduce((exSum, ex) => exSum + ex.caloriesBurned, 0);
    }, 0);

    return res.status(200).json({
      calorieBurntGoal,
      calorieBurntBurned: totalCaloriesBurned,
      message: "Calorie burnt for today retrieved successfully",
    });
  } catch (err) {
    console.error('Error fetching calorie burnt for today:', err);
    return res.status(500).json({
      error: true,
      message: "An error occurred while fetching calorie burnt for today",
      details: err.message,
    });
  }
});
app.get('/getCalorieComparisonForPast5Days', authenticateToken, async (req, res) => {
  const { user } = req.user;
  if (!user) {
    return res.status(404).json({ error: true, message: "User not found" });
  }

  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today
  const fiveDaysAgo = new Date();
  fiveDaysAgo.setDate(today.getDate() - 4); // Start from 5 days ago
  fiveDaysAgo.setHours(0, 0, 0, 0);

  console.log('Date range:', { fiveDaysAgo, today });

  try {
    // Fetch calorie intake data within the past 5 days
    const calorieIntakeRecords = await CalorieIntake.find({
      user: user._id,
      date: { $gte: fiveDaysAgo, $lte: today },
    });
    console.log('Calorie Intake Records:', calorieIntakeRecords);

    // Fetch exercise data within the past 5 days
    const exerciseRecords = await Exercise.find({
      user: user._id,
      date: { $gte: fiveDaysAgo, $lte: today },
    });
    console.log('Exercise Records:', exerciseRecords);

    // Create labels for each of the past 5 days
    const labels = Array.from({ length: 5 }, (_, i) => {
      const date = new Date(today.getTime() - (4 - i) * 24 * 60 * 60 * 1000);
      return date.toISOString().split('T')[0];
    });
    console.log('Labels for comparison:', labels);

    // Calculate calorie intake per day
    const calorieIntake = labels.map(date => {
      const dailyIntake = calorieIntakeRecords
        .filter(record => record.date.toISOString().split('T')[0] === date)
        .reduce((sum, record) => sum + record.calories, 0);
      return dailyIntake;
    });

    // Calculate calories burnt per day
    const calorieBurnt = labels.map(date => {
      const dailyBurn = exerciseRecords
        .filter(record => record.date.toISOString().split('T')[0] === date)
        .reduce((sum, record) => {
          return sum + record.exercises.reduce((exSum, ex) => exSum + ex.caloriesBurned, 0);
        }, 0);
      return dailyBurn;
    });

    const comparisonData = {
      labels,
      datasets: [
        {
          label: 'Calorie Intake',
          data: calorieIntake,
          backgroundColor: '#36A2EB',
        },
        {
          label: 'Calorie Burnt',
          data: calorieBurnt,
          backgroundColor: '#FF6384',
        },
      ],
    };

    return res.status(200).json(comparisonData);
  } catch (err) {
    console.error('Error fetching calorie comparison for past 5 days:', err);
    return res.status(500).json({
      error: true,
      message: "An error occurred while fetching calorie comparison for past 5 days",
      details: err.message,
    });
  }
});



module.exports = app;

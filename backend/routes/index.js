require("dotenv").config();
const express = require("express");
// const { GoogleGenerativeAI } = require("@google/generative-ai");
// const apiKey = "AIzaSyC9bRubY0YXF3fDkAHjfIbOquoLeTfhf6k"; 
// const genAI = new GoogleGenerativeAI(apiKey);

const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require("@google/generative-ai");

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

// const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-flash",
// });
// const generationConfig = {
//   temperature: 1,
//   topP: 0.95,
//   topK: 64,
//   maxOutputTokens: 8192,
//   responseMimeType: "text/plain",
// };
const cors = require("cors");
const app = express();
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const Exercise = require("../models/calorieBurnt.model");
const CalorieIntake = require("../models/calorieIntake.model");
const dietPlan=require("../models/dietPlan.model")
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
  const { user } = req;
  const { weight, goal, height, dietPreference, mealsPerDay, otherDetails } = req.body;
  const userId = user._id;

  // Check for missing fields
  if (!weight || !goal || !height || !dietPreference || !mealsPerDay || !otherDetails) {
    return res.status(400).json({
      error: true,
      message: "Please provide all required fields: weight, goal, height, dietPreference, mealsPerDay, and otherDetails",
    });
  }

  // Create prompt for diet plan generation
  const prompt = `
  Create a diet plan for a person with the following details:
  - Current weight: ${weight} kg
  - Height: ${height} cm
  - Goal: ${goal} (e.g., lose weight, gain muscle, maintain weight)
  - Diet preference: ${dietPreference} (veg or non-veg)
  - Meals per day: ${mealsPerDay}
  ${otherDetails ? `- Other details: ${otherDetails}` : ""}
  
  The diet plan should include meal names, food items, and the nutritional value for each meal (fat, protein, carbs, calories).
  
  **Important**:
  - Output **only** valid JSON.
  - Do **not** include any additional text, warnings, or explanations.
  - JSON should follow the structure:
    {
      "diet_plan": {
        "meals": [
          {
            "meal_name": "Meal name",
            "food_items": ["Item 1", "Item 2", ...],
            "nutritional_value": {
              "fat": "value in g",
              "protein": "value in g",
              "carbs": "value in g",
              "calories": value in kcal
            }
          }
        ]
      }
    }
  - The output should be in JSON format or should be parsed into JSON format.
  `;

  try {
    const chatSession = model.startChat({
      generationConfig,
   // safetySettings: Adjust safety settings
   // See https://ai.google.dev/gemini-api/docs/safety-settings
      history: [
        {
          role: "user",
          parts: [
            {text: "const prompt = `\n  Create a diet plan for a person with the following details:\n  - Current weight: ${weight} kg\n  - Height: ${height} cm\n  - Goal: ${goal} (e.g., lose weight, gain muscle, maintain weight)\n  - Diet preference: ${dietPreference} (veg or non-veg)\n  - Meals per day: ${mealsPerDay}\n  ${otherDetails ? `- Other details: ${otherDetails}` : \"\"}\n  \n  The diet plan should include meal names, food items, and the nutritional value for each meal (fat, protein, carbs, calories).\n  \n  **Important**:\n  - Output **only** valid JSON.\n  - Do **not** include any additional text, warnings, or explanations.\n  - JSON should follow the structure:\n    {\n      \"diet_plan\": {\n        \"meals\": [\n          {\n            \"meal_name\": \"Meal name\",\n            \"food_items\": [\"Item 1\", \"Item 2\", ...],\n            \"nutritional_value\": {\n              \"fat\": \"value in g\",\n              \"protein\": \"value in g\",\n              \"carbs\": \"value in g\",\n              \"calories\": value in kcal\n            }\n          }\n        ]\n      }\n    }\n  - Provide me in JSON format.\n  `;\n\nThe output should be in JSON format or should be parsed into JSON format. This is an API Send API Response as JSON data \n"},
          ],
        },
        {
          role: "model",
          parts: [
            {text: "```json\n{\n  \"diet_plan\": {\n    \"meals\": [\n      {\n        \"meal_name\": \"Breakfast\",\n        \"food_items\": [\n          \"2 slices whole wheat toast\",\n          \"1 egg\",\n          \"1/2 cup fruit\",\n          \"1/4 cup low-fat yogurt\"\n        ],\n        \"nutritional_value\": {\n          \"fat\": \"10g\",\n          \"protein\": \"20g\",\n          \"carbs\": \"40g\",\n          \"calories\": \"300kcal\"\n        }\n      },\n      {\n        \"meal_name\": \"Lunch\",\n        \"food_items\": [\n          \"1 cup salad with grilled chicken/tofu\",\n          \"1/2 cup brown rice\",\n          \"1/4 cup mixed vegetables\"\n        ],\n        \"nutritional_value\": {\n          \"fat\": \"15g\",\n          \"protein\": \"30g\",\n          \"carbs\": \"50g\",\n          \"calories\": \"400kcal\"\n        }\n      },\n      {\n        \"meal_name\": \"Dinner\",\n        \"food_items\": [\n          \"4 oz baked salmon/chicken breast\",\n          \"1/2 cup quinoa\",\n          \"1 cup steamed vegetables\"\n        ],\n        \"nutritional_value\": {\n          \"fat\": \"20g\",\n          \"protein\": \"40g\",\n          \"carbs\": \"60g\",\n          \"calories\": \"500kcal\"\n        }\n      },\n      {\n        \"meal_name\": \"Snack\",\n        \"food_items\": [\n          \"1/4 cup trail mix\",\n          \"1 small apple\"\n        ],\n        \"nutritional_value\": {\n          \"fat\": \"5g\",\n          \"protein\": \"10g\",\n          \"carbs\": \"20g\",\n          \"calories\": \"150kcal\"\n        }\n      }\n    ]\n  }\n}\n```\n\n**Explanation:**\n\nThis JSON response provides a sample diet plan with four meals (breakfast, lunch, dinner, and a snack). You can adjust the meals, food items, and nutritional values based on the user's specific details (weight, height, goal, diet preference, etc.) and the provided `prompt`.\n\n**Important:**\n\n* This is a **generalized** response. You need to replace the placeholder values with actual data from the `prompt`.\n* You should use a library or algorithm that can calculate nutritional values based on the food items provided.\n* This response does not include any personalized recommendations or adjustments based on the user's specific needs.\n\nTo create a complete and personalized diet plan, you need to:\n\n1. **Parse the input string:** Extract the user's details from the `prompt` using string manipulation techniques or regular expressions.\n2. **Calculate nutritional values:** Use a library or algorithm to determine the nutritional values of each food item.\n3. **Customize the plan:** Generate a diet plan that aligns with the user's goal, diet preference, and other details.\n4. **Format the output:** Structure the data into the specified JSON format.\n\nRemember that generating personalized and accurate diet plans requires specialized knowledge and algorithms. It's recommended to use libraries or APIs designed specifically for this purpose. \n"},
          ],
        },
      ],
    });
  
    const result = await chatSession.sendMessage(prompt)
    console.log(result.response.text());

    // Assuming `dietPlanNew` is a model, uncomment to save the diet plan to the database
    // const dietPlanNew = new dietPlan({
    //   user: userId,
    //   goal,
    //   dietPreference,
    //   mealsPerDay,
    //   meals: dietPlanResponse.diet_plan.meals,
    // });
    // await dietPlanNew.save();

    // Return success response
    return res.status(200).json({
      error: false,
      message: "Diet plan generated and saved successfully",
      dietPlanNew: dietPlanResponse.diet_plan, // Returning the generated plan
    });

  } catch (error) {
    console.error("Internal Server Error:", error);
    return res.status(500).json({
      error: true,
      message: "Some internal error occurred",
    });
  }
});


app.listen(8000, () => {
  console.log("server is running at port 8000");
});
module.exports = app;

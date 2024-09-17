const mongoose = require("mongoose");

const dietPlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
  goal: {
    type: String,
    enum: ["lose weight", "gain weight", "maintain weight"],
    required: true,
  },
  dietPreference: {
    type: String,
    enum: ["vegetarian", "non-vegetarian"],
    required: true,
  },
  mealsPerDay: {
    type: Number,
    required: true,
  },
  meals: [
    {
      mealName: {
        type: String,
        required: true,
      },
      foodItems: [
        {
          type: String,
          required: true,
        },
      ],
      nutritionalValue: {
        fat: {
          type: String, // Storing as a string (e.g., "15g")
          required: true,
        },
        protein: {
          type: String,
          required: true,
        },
        carbs: {
          type: String,
          required: true,
        },
        calories: {
          type: Number,
          required: true,
        },
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("DietPlan", dietPlanSchema);

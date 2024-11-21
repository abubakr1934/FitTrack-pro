const mongoose = require('mongoose');

const exercisePlanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  goal: {
    type: String,
    enum: ["lose weight", "gain weight", "maintain weight", "gain muscle"],
    required: true,
  },
  exerciseSessionPerWeek: {
    type: Number,
    required: true,
  },
  healthConditions: {
    type: String,
    required: true,
  },
  calorieIntakeGoal: {
    type: Number,
    required: true,
  },
  calorieBurntGoal: {
    type: Number,
    required: true,
  },
  exercises: [
    {
      name: {
        type: String,
        required: true,
      },
      duration: {
        type: Number, // in minutes
        required: true,
      },
      intensity: {
        type: String,
        enum: ["low", "moderate", "high"],
        required: true,
      },
      caloriesBurned: {
        type: Number, // estimated calories burned
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model("ExercisePlan", exercisePlanSchema);
const mongoose = require('mongoose');

const calorieBurnt = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  exercises: [
    {
      exerciseName: {
        type: String,
        required: true,
      },
      muscleGroup: {
        type: String,
        required: true,
      },
      duration: {
        type: Number, 
        required: true,
      },
      caloriesBurned: {
        type: Number,
        required: true,
      },
    },
  ],
  totalCaloriesBurned: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('calorieBurnt', calorieBurnt);

const mongoose = require('mongoose');

const calorieIntake = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  foodItems: [
    {
      foodName: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number, 
        required: true,
      },
      fat: {
        type: Number,
        required: true,
      },
      protein: {
        type: Number,
        required: true,
      },
      carbs: {
        type: Number,
        required: true,
      },
      calories: {
        type: Number,
        required: true,
      },
    },
  ],
});

module.exports = mongoose.model('calorieIntake', calorieIntake);

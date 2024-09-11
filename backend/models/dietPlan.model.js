const mongoose = require('mongoose');

const dietPlan = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  planName: {
    type: String,
    required: true,
  },
  meals: [
    {
      mealType: {
        type: String, 
        required: true,
      },
      items: [
        {
          foodName: String,
          calories: Number,
          protein: Number,
          carbs: Number,
          fat: Number,
        },
      ],
    },
  ],
  totalCalories: {
    type: Number,
    required: true,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('dietPlan', dietPlan);

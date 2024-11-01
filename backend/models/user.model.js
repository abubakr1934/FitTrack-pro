const mongoose = require('mongoose');

const user = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['regular', 'premium'],
    default: 'regular',
  },
  profile: {
    age: {
      type: Number,
      default: 25,
    },
    height: {
      type: Number,
      default: 25,
    },
    weight: {
      type: Number,
      default: 25,
    },
    goal: {
      type: String,
      enum: ['lose weight', 'gain muscle', 'maintain'],
      default: 'maintain',
    },
    calorieIntakeGoal: {
      type: Number,
      default: 2000, 
    },
    calorieBurntGoal: {
      type: Number,
      default: 500, 
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('user', user);
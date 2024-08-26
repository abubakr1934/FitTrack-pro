import React, { useState } from "react";
import '../../../App.css'

const Exercise = () => {
  const [exercise, setExercise] = useState("");
  const [hours, setHours] = useState("");
  const [caloriesBurnt, setCaloriesBurnt] = useState("");
  const [totalCalories, setTotalCalories] = useState(null);

  const calculateTotalCalories = () => {
    const hoursNum = parseFloat(hours);
    const caloriesNum = parseFloat(caloriesBurnt);

    if (isNaN(hoursNum) || isNaN(caloriesNum)) {
      setTotalCalories("Please enter valid numbers for all fields.");
      return;
    }

    const total = hoursNum * caloriesNum;
    setTotalCalories(total.toFixed(2));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="p-6 rounded-lg shadow-md w-[30rem] bg">
        <h2 className="text-4xl text-white font-medium mb-4 text-center">Exercise Tracker</h2>
        
        <div className="mb-4">
          <label className="block text-white text-sm font-medium mb-2" htmlFor="exercise">
            Exercise Name
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
            id="exercise"
            type="text"
            placeholder="Enter the exercise name"
            value={exercise}
            onChange={(e) => setExercise(e.target.value)}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="hours">
            Hours Done
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
            id="hours"
            type="text"
            placeholder="Enter the number of hours"
            value={hours}
            onChange={(e) => setHours(e.target.value)}
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="caloriesBurnt">
            Calories Burnt Per Hour
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline"
            id="caloriesBurnt"
            type="text"
            placeholder="Enter calories burnt per hour"
            value={caloriesBurnt}
            onChange={(e) => setCaloriesBurnt(e.target.value)}
          />
        </div>
        
        <div className="flex flex-row justify-center">
          <button
            className="bg-white text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-1/2"
            onClick={calculateTotalCalories}
          >
            Calculate Total Calories
          </button>
        </div>
        
        {totalCalories && (
          <div className="mt-4 text-center">
            <p className="text-xl font-bold text-white">Total Calories Burnt: {totalCalories} kcal</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Exercise;

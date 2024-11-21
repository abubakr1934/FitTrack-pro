import React, { useState, useEffect } from "react";
import axios from "axios";

const CustomExercisePlan = () => {
  const [goal, setGoal] = useState("");
  const [exerciseSessionPerWeek, setExerciseSessionPerWeek] = useState("");
  const [healthConditions, setHealthConditions] = useState("");
  const [calorieIntakeGoal, setCalorieIntakeGoal] = useState("");
  const [calorieBurntGoal, setCalorieBurntGoal] = useState("");
  const [exercisePlan, setExercisePlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch exercise plan on component load
  useEffect(() => {
    fetchExercisePlan();
  }, []);

  const fetchExercisePlan = async () => {
    try {
      const response = await axios.get("http://localhost:8000/get-exercise-plan", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (response.data.exercisePlan) {
        setExercisePlan(response.data.exercisePlan);
      } else {
        setExercisePlan(null);
      }
    } catch (err) {
      console.error("Error fetching exercise plan:", err);
      setError("Failed to fetch exercise plan. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:8000/generate-exercise-plan",
        {
          goal,
          exerciseSessionPerWeek,
          healthConditions,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.data.error) {
        setError(response.data.message);
      } else {
        fetchExercisePlan(); // Refresh plan after generating
      }
    } catch (err) {
      console.error("Error generating exercise plan:", err);
      setError("Failed to generate exercise plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete("http://localhost:8000/delete-exercise-plan", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setExercisePlan(null); // Reset to show form again
    } catch (err) {
      console.error("Error deleting exercise plan:", err);
      setError("Failed to delete exercise plan. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto shadow-lg rounded-lg bg-white">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Custom Exercise Plan
      </h2>

      {exercisePlan ? (
        <div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Your Exercise Plan
          </h3>
          <div className="p-4 bg-gray-100 rounded-lg mb-4 shadow">
            <p><strong>Goal:</strong> {exercisePlan.goal}</p>
            <p><strong>Exercise Sessions Per Week:</strong> {exercisePlan.exerciseSessionPerWeek}</p>
            <p><strong>Health Conditions:</strong> {exercisePlan.healthConditions}</p>
            <p><strong>Calorie Intake Goal:</strong> {exercisePlan.calorieIntakeGoal}</p>
            <p><strong>Calorie Burnt Goal:</strong> {exercisePlan.calorieBurntGoal}</p>
          </div>
          <button
            onClick={handleDelete}
            className="w-full py-3 bg-red-600 text-white font-semibold rounded-md shadow-lg hover:bg-red-700 transition duration-300 ease-in-out"
          >
            Delete and Generate New Plan
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Goal
            </label>
            <select
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500"
            >
              <option value="">Select your goal</option>
              <option value="lose weight">Lose Weight</option>
              <option value="gain weight">Gain Weight</option>
              <option value="maintain weight">Maintain Weight</option>
              <option value="gain muscle">Gain Muscle</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Exercise Sessions Per Week
            </label>
            <input
              type="number"
              value={exerciseSessionPerWeek}
              onChange={(e) => setExerciseSessionPerWeek(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">
              Health Conditions
            </label>
            <textarea
              value={healthConditions}
              onChange={(e) => setHealthConditions(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500"
              rows="3"
            />
          </div>

          

          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-lg hover:bg-indigo-700 transition duration-300 ease-in-out"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Exercise Plan"}
          </button>
        </form>
      )}

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
};

export default CustomExercisePlan;

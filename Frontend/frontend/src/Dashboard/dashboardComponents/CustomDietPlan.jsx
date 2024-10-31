import React, { useState, useEffect } from "react";
import axios from "axios";

const DietPlan = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [goal, setGoal] = useState("");
  const [dietPreference, setDietPreference] = useState("");
  const [mealsPerDay, setMealsPerDay] = useState("");
  const [otherDetails, setOtherDetails] = useState("");
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchDietPlan();
  }, []);

  const fetchDietPlan = async () => {
    try {
      const response = await axios.get("http://localhost:8000/get-diet-plan", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      if (response.data.dietPlan) {
        setDietPlan(response.data.dietPlan);
      } else {
        setShowForm(true);
      }
    } catch (err) {
      console.error("Error fetching diet plan:", err);
      setError("Failed to fetch diet plan. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:8000/generate-diet-plan",
        {
          weight,
          height,
          goal,
          dietPreference,
          mealsPerDay,
          otherDetails,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (response.data.error) {
        setError(response.data.message);
        setDietPlan(null);
      } else {
        setDietPlan(response.data.dietPlan);
        setShowForm(false);
      }
    } catch (err) {
      console.error("Error generating diet plan:", err);
      setError("Failed to generate diet plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete("http://localhost:8000/delete-diet-plan", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });
      setDietPlan(null);
      setShowForm(true);
    } catch (err) {
      console.error("Error deleting diet plan:", err);
      setError("Failed to delete diet plan. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto shadow-lg rounded-lg bg-white">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
        Custom Diet Plan
      </h2>

      {dietPlan ? (
        <div clas>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Your Diet Plan
          </h3>
          {dietPlan.meals.map((meal, index) => (
            <div key={index} className="p-4 bg-gray-100 rounded-lg mb-4 shadow">
              <h4 className="text-md font-semibold text-gray-700">
                {meal.mealName}
              </h4>
              <ul className="list-disc ml-5 text-gray-600">
                {meal.foodItems.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <div className="text-sm mt-2 text-gray-700">
                <strong>Nutritional Value:</strong>
                <p>Fat: {meal.nutritionalValue.fat}</p>
                <p>Protein: {meal.nutritionalValue.protein}</p>
                <p>Carbs: {meal.nutritionalValue.carbs}</p>
                <p>Calories: {meal.nutritionalValue.calories} kcal</p>
              </div>
            </div>
          ))}
          <button
            onClick={handleDelete}
            className="w-full py-3 bg-red-600 text-white font-semibold rounded-md shadow-lg hover:bg-red-700 transition duration-300 ease-in-out"
          >
            Delete and Generate New Plan
          </button>
        </div>
      ) : (
        showForm && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Weight (kg)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Height (cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

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
                Diet Preference
              </label>
              <select
                value={dietPreference}
                onChange={(e) => setDietPreference(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500"
              >
                <option value="">Select preference</option>
                <option value="vegetarian">Vegetarian</option>
                <option value="non-vegetarian">Non-Vegetarian</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Meals Per Day
              </label>
              <input
                type="number"
                value={mealsPerDay}
                onChange={(e) => setMealsPerDay(e.target.value)}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Other Details
              </label>
              <textarea
                value={otherDetails}
                onChange={(e) => setOtherDetails(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500"
                rows="3"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-md shadow-lg hover:bg-indigo-700 transition duration-300 ease-in-out"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Diet Plan"}
            </button>
          </form>
        )
      )}

      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
    </div>
  );
};

export default DietPlan;

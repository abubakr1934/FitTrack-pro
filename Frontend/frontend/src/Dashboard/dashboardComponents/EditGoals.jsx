import React, { useState, useEffect } from "react";
import axios from "axios";

const EditGoals = () => {
  const [calorieIntakeGoal, setCalorieIntakeGoal] = useState("");
  const [calorieBurntGoal, setCalorieBurntGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchUserGoals = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get("http://localhost:8000/getUserGoals", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        });

        console.log("Fetch User Goals Response:", response.data); // Debugging line

        const { calorieIntakeGoal, calorieBurntGoal } =
          response.data.user.profile;
        setCalorieIntakeGoal(calorieIntakeGoal);
        setCalorieBurntGoal(calorieBurntGoal);
      } catch (error) {
        console.error("Fetch User Goals Error:", error); // Debugging line
        setError("Failed to fetch user goals.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserGoals();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.put(
        "http://localhost:8000/updateUserGoals",
        { calorieIntakeGoal, calorieBurntGoal },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      console.log("Update User Goals Response:", response.data); // Debugging line

      setSuccess("Goals updated successfully!");
    } catch (error) {
      console.error("Update User Goals Error:", error); // Debugging line
      setError("Failed to update goals.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-row justify-center items-center mt-5">
      <div className="p-6 bg-white shadow-lg rounded-lg w-1/2">
        <h2 className="text-2xl font-bold mb-4">Edit Goals</h2>

        {loading && <p>Loading...</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Calorie Intake Goal
            </label>
            <input
              type="number"
              value={calorieIntakeGoal}
              onChange={(e) => setCalorieIntakeGoal(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Calorie Burnt Goal
            </label>
            <input
              type="number"
              value={calorieBurntGoal}
              onChange={(e) => setCalorieBurntGoal(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Goals"}
          </button>
        </form>
        <div className="flex flex-row justify-center items-center mt-4">
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
        </div>
      </div>
    </div>
  );
};

export default EditGoals;

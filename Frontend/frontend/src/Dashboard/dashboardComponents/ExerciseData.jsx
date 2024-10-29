import React, { useState, useEffect } from "react";
import axios from "axios";

const ExerciseData = () => {
  const [exercises, setExercises] = useState([]);
  const [selectedOption, setSelectedOption] = useState("today");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExercises = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("Access Token:", localStorage.getItem("accessToken"));
        console.log("Fetching exercises for time frame:", selectedOption);
        const response = await axios.get(
          `http://localhost:8000/getAllExercises?timeFrame=${selectedOption}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        console.log("Response from API:", response.data);
        if (response.data.error) {
          setError(response.data.message);
          setExercises([]);
        } else {
          setExercises(response.data.excs || []);
          console.log(exercises);
        }
      } catch (error) {
        console.error("Error fetching exercises:", error);
        setError("Failed to fetch exercises.");
      } finally {
        setLoading(false);
      }
    };

    fetchExercises();
  }, [selectedOption]);

  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Exercise Data</h2>

      <div className="mb-4">
        <label
          htmlFor="timeFrame"
          className="block text-sm font-medium text-gray-700"
        >
          Select Time Frame:
        </label>
        <select
          id="timeFrame"
          name="timeFrame"
          value={selectedOption}
          onChange={handleOptionChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="today">Today</option>
          <option value="yesterday">Yesterday</option>
          <option value="past5days">Past 5 Days</option>
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Date
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Exercises
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Total Calories Burned
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {exercises.length > 0 ? (
              exercises.map((exercise) => (
                <tr key={exercise._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(exercise.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {exercise.exercises.map((ex) => ex.exerciseName).join(", ")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {exercise.totalCaloriesBurned}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                >
                  No exercises found for the selected timeframe.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExerciseData;

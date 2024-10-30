import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const ExerciseData = () => {
  const [exercises, setExercises] = useState([]);
  const [selectedOption, setSelectedOption] = useState("today");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCalories, setTotalCalories] = useState(0);
  const [past5DaysCalories, setPast5DaysCalories] = useState([]);

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
          const fetchedExercises = response.data.exercises || [];
          setExercises(fetchedExercises);

          // Calculate total calories for today or yesterday
          if (selectedOption === "today" || selectedOption === "yesterday") {
            const total = fetchedExercises.reduce(
              (sum, exercise) =>
                sum +
                exercise.exercises.reduce((innerSum, ex) => innerSum + ex.caloriesBurned, 0),
              0
            );
            setTotalCalories(total);
          }

          // Prepare data for past 5 days bar chart
          if (selectedOption === "past5days") {
            const caloriesByDay = fetchedExercises.reduce((acc, exercise) => {
              const date = new Date(exercise.date).toLocaleDateString();
              const calories = exercise.exercises.reduce((sum, ex) => sum + ex.caloriesBurned, 0);

              if (acc[date]) {
                acc[date].calories += calories;
              } else {
                acc[date] = { date, calories };
              }

              return acc;
            }, {});

            setPast5DaysCalories(Object.values(caloriesByDay));
          }
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
    setTotalCalories(0);
    setPast5DaysCalories([]);
  };

  // Generate an array of colors for each day
  const generateColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(`rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`);
    }
    return colors;
  };

  const barChartData = {
    labels: past5DaysCalories.map((data) => data.date),
    datasets: [
      {
        label: "Calories Burned",
        data: past5DaysCalories.map((data) => data.calories),
        backgroundColor: generateColors(past5DaysCalories.length), // Use generated colors
      },
    ],
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Exercise Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Muscle Group
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duration (min)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Calories Burned (cal)
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
                    {exercise.exercises.map((ex) => ex.muscleGroup).join(", ")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {exercise.exercises.map((ex) => ex.duration).join(", ")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {exercise.exercises.map((ex) => ex.caloriesBurned).join(", ")}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                >
                  No exercises found for the selected timeframe.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedOption !== "past5days" && (
        <div className="mt-4">
          <h3 className="text-lg font-medium">Total Calories Burned: {totalCalories} cal</h3>
        </div>
      )}

      {selectedOption === "past5days" && (
        <div className="mt-4">
          <h3 className="text-lg font-medium">Calories Burned in Past 5 Days</h3>
          <div style={{ height: '300px' }}>
            <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseData;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const FoodData = () => {
  const [foodEntries, setFoodEntries] = useState([]);
  const [selectedOption, setSelectedOption] = useState("today");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [totalCalories, setTotalCalories] = useState(0);
  const [past5DaysCalories, setPast5DaysCalories] = useState([]);

  useEffect(() => {
    const fetchFoodEntries = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("Access Token:", localStorage.getItem("accessToken"));
        console.log("Fetching food entries for time frame:", selectedOption);
        const response = await axios.get(
          `http://localhost:8000/getAllFoodEntries?timeFrame=${selectedOption}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );

        console.log("Response from API:", response.data);
        if (response.data.error) {
          setError(response.data.message);
          setFoodEntries([]);
        } else {
          const fetchedFoodEntries = response.data.foodEntries || [];
          setFoodEntries(fetchedFoodEntries);

          // Calculate total calories for today or yesterday
          if (selectedOption === "today" || selectedOption === "yesterday") {
            const total = fetchedFoodEntries.reduce(
              (sum, foodEntry) => sum + foodEntry.calories,
              0
            );
            setTotalCalories(total);
          }

          // Prepare data for past 5 days bar chart
          if (selectedOption === "past5days") {
            const caloriesByDay = fetchedFoodEntries.reduce((acc, foodEntry) => {
              const date = new Date(foodEntry.date).toLocaleDateString();
              const calories = foodEntry.calories;

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
        console.error("Error fetching food entries:", error);
        setError("Failed to fetch food entries.");
      } finally {
        setLoading(false);
      }
    };

    fetchFoodEntries();
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
        label: "Calories Consumed",
        data: past5DaysCalories.map((data) => data.calories),
        backgroundColor: generateColors(past5DaysCalories.length), // Use generated colors
      },
    ],
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Food Data</h2>

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
                Food Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fat (g)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Protein (g)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Carbs (g)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Calories (cal)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {foodEntries.length > 0 ? (
              foodEntries.map((foodEntry) => (
                <tr key={foodEntry._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(foodEntry.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {foodEntry.foodName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {foodEntry.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {foodEntry.fat}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {foodEntry.protein}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {foodEntry.carbs}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {foodEntry.calories}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-4 whitespace-nowrap text-center text-gray-500"
                >
                  No food entries found for the selected timeframe.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selectedOption !== "past5days" && (
        <div className="mt-4">
          <h3 className="text-lg font-medium">Total Calories Consumed: {totalCalories} cal</h3>
        </div>
      )}

      {selectedOption === "past5days" && (
        <div className="mt-4">
          <h3 className="text-lg font-medium">Calories Consumed in Past 5 Days</h3>
          <div style={{ height: '300px' }}>
            <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodData;
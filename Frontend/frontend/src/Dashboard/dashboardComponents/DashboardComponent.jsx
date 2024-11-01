import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const DashboardComponent = () => {
  const [calorieIntakeData, setCalorieIntakeData] = useState(null);
  const [calorieBurntData, setCalorieBurntData] = useState(null);
  const [calorieComparisonData, setCalorieComparisonData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);

      try {
        const [
          calorieIntakeResponse,
          calorieBurntResponse,
          calorieComparisonResponse,
        ] = await Promise.all([
          axios.get('http://localhost:8000/getCalorieIntakeForToday', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }),
          axios.get('http://localhost:8000/getCalorieBurntForToday', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }),
          axios.get('http://localhost:8000/getCalorieComparisonForPast5Days', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          }),
        ]);

        const calorieIntakeGoal = calorieIntakeResponse.data.calorieIntakeGoal;
        const calorieIntakeConsumed = calorieIntakeResponse.data.calorieIntakeConsumed;
        const calorieBurntGoal = calorieBurntResponse.data.calorieBurntGoal;
        const calorieBurntBurned = calorieBurntResponse.data.calorieBurntBurned;

        setCalorieIntakeData({
          labels: ['Consumed', 'Remaining'],
          datasets: [
            {
              data: [calorieIntakeConsumed, calorieIntakeGoal - calorieIntakeConsumed],
              backgroundColor: ['#36A2EB', '#FF6384'],
            },
          ],
        });

        setCalorieBurntData({
          labels: ['Burned', 'Remaining'],
          datasets: [
            {
              data: [calorieBurntBurned, calorieBurntGoal - calorieBurntBurned],
              backgroundColor: ['#36A2EB', '#FF6384'],
            },
          ],
        });

        setCalorieComparisonData(calorieComparisonResponse.data);
      } catch (error) {
        setError('Failed to fetch dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const renderMessage = (goal, consumed, type) => {
    if (consumed >= goal) {
      return <p className="text-green-500">Goal completed!</p>;
    } else {
      return <p className="text-red-500">Remaining {type}: {goal - consumed} cal</p>;
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="flex flex-row justify-around mb-8">
        <div>
          <h3 className="text-lg font-medium mb-2">Calorie Intake</h3>
          {calorieIntakeData ? (
            <Pie data={calorieIntakeData} />
          ) : (
            <p>No data available</p>
          )}
          {calorieIntakeData && renderMessage(
            calorieIntakeData.datasets[0].data[0] + calorieIntakeData.datasets[0].data[1],
            calorieIntakeData.datasets[0].data[0],
            'Calorie Intake'
          )}
        </div>

        <div>
          <h3 className="text-lg font-medium mb-2">Calorie Burnt</h3>
          {calorieBurntData ? (
            <Pie data={calorieBurntData} />
          ) : (
            <p>No data available</p>
          )}
          {calorieBurntData && renderMessage(
            calorieBurntData.datasets[0].data[0] + calorieBurntData.datasets[0].data[1],
            calorieBurntData.datasets[0].data[0],
            'Calorie Burnt'
          )}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-2">Calorie Intake vs. Calorie Burnt (Past 5 Days)</h3>
        {calorieComparisonData ? (
          <Bar data={calorieComparisonData} />
        ) : (
          <p>No data available</p>
        )}
      </div>
    </div>
  );
};

export default DashboardComponent;
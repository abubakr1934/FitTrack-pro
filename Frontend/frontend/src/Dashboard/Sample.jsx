import React from 'react';
import { useState } from 'react';
import Navbar1 from './Navbar/Navbar1';
import Sidebar from './Sidebar/Sidebar';
import FoodData from './dashboardComponents/FoodData';
import FoodForm from './dashboardComponents/FoodForm';
import ExerciseData from './dashboardComponents/ExerciseData';
import ExerciseForm from './dashboardComponents/ExerciseForm';
import CustomDietPlan from './dashboardComponents/CustomDietPlan';
import DashboardComponent from './dashboardComponents/DashboardComponent';
import EditGoals from './dashboardComponents/EditGoals';
import CustomExercisePlan from './dashboardComponents/CustomExercisePlan';
const Sample = () => {
  const [activePage, setActivePage] = useState('dashboard');

  const renderContent = () => {
    switch (activePage) {
      case 'dashboard':
        return <DashboardComponent />;
      case 'exercise-form':
        return <ExerciseForm />;
      case 'exercise-data':
        return <ExerciseData />;
      case 'food-form':
        return <FoodForm />;
      case 'food-data':
        return <FoodData />;
      case 'diet-plan':
        return <CustomDietPlan />;
      case 'edit-goals':
        return <EditGoals/>;
      default:
        return <DashboardComponent />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Navbar1 />
      <div className="flex pt-16">
        <Sidebar activePage={activePage} setActivePage={setActivePage} />
        <main className="flex-1 ml-64 p-6 min-h-screen">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Sample;
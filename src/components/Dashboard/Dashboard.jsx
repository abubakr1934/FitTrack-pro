import React, { useState } from "react";
import NavbarDashboard from "./NavbarDashboard";
import BodyFatCalculator from "./BodyFatCalculator/BodyFatCalculator";
import Exercise from "./Exercise/Exercise"; 

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState("Dashboard");

  const renderContent = () => {
    switch (activeSection) {
      case "Body Fat Calculator":
        return <BodyFatCalculator />;
      case "Calories":
        return <div>Calories Component</div>;
      case "Exercises":
        return <Exercise />; 
      case "Personalised Diet Plan":
        return <div>Personalised Diet Plan Component</div>;
      default:
        return <div>Dashboard Content</div>;
    }
  };

  return (
    <div className="flex flex-row min-h-screen">
      <NavbarDashboard setActiveSection={setActiveSection} />
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-4xl p-4">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Dashboard;

import React, { useState } from "react";
import '../../../App.css'
const BodyFatCalculator = () => {
  const [weight, setWeight] = useState("");
  const [waist, setWaist] = useState("");
  const [wrist, setWrist] = useState("");
  const [hip, setHip] = useState("");
  const [forearm, setForearm] = useState("");
  const [bodyFat, setBodyFat] = useState(null);

  const calculateBodyFat = () => {
    const weightNum = parseFloat(weight);
    const waistNum = parseFloat(waist);
    const wristNum = parseFloat(wrist);
    const hipNum = parseFloat(hip);
    const forearmNum = parseFloat(forearm);

    if (isNaN(weightNum) || isNaN(waistNum) || isNaN(wristNum) || isNaN(hipNum) || isNaN(forearmNum)) {
      setBodyFat("Please enter valid numbers for all fields.");
      return;
    }
    const bodyFatPercentage =
      (weightNum * 0.732 + 8.987 + wristNum / 3.14 - waistNum * 0.157 - hipNum * 0.249 + forearmNum * 0.434) /
      weightNum;

    setBodyFat((100 - bodyFatPercentage * 100).toFixed(2));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen ">
      <div className=" p-6 rounded-lg shadow-md w-[30rem] bg">
        <h2 className="text-4xl text-white font-medium mb-4 text-center">Body Fat Calculator</h2>
        <div className="mb-4">
          <label className="block text-white text-sm font-medium mb-2" htmlFor="weight">
            Weight (lbs)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black     leading-tight focus:outline-none focus:shadow-outline"
            id="weight"
            type="text"
            placeholder="Enter your weight"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="waist">
            Waist (inches)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black  leading-tight focus:outline-none focus:shadow-outline"
            id="waist"
            type="text"
            placeholder="Enter your waist measurement"
            value={waist}
            onChange={(e) => setWaist(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="wrist">
            Wrist (inches)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black  leading-tight focus:outline-none focus:shadow-outline"
            id="wrist"
            type="text"
            placeholder="Enter your wrist measurement"
            value={wrist}
            onChange={(e) => setWrist(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="hip">
            Hip (inches)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black  leading-tight focus:outline-none focus:shadow-outline"
            id="hip"
            type="text"
            placeholder="Enter your hip measurement"
            value={hip}
            onChange={(e) => setHip(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-white text-sm font-bold mb-2" htmlFor="forearm">
            Forearm (inches)
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-black  leading-tight focus:outline-none focus:shadow-outline"
            id="forearm"
            type="text"
            placeholder="Enter your forearm measurement"
            value={forearm}
            onChange={(e) => setForearm(e.target.value)}
          />
        </div>
        <div className="flex flex-row justify-center">
        <button
          className="bg-white text-black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-1/2  "
          onClick={calculateBodyFat}
        >
          Calculate Body Fat
        </button>
        </div>
        {bodyFat && (
          <div className="mt-4 text-center">
            <p className="text-xl font-bold text-white  ">Body Fat Percentage: {bodyFat}%</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BodyFatCalculator;

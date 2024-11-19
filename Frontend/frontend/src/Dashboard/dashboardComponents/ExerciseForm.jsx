import React, { useState, useEffect } from "react";
import axios from "axios";
import Modal from "./Modal";

const ExerciseForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [formData, setFormData] = useState({
    exerciseName: "",
    muscleGroup: "",
    duration: "",
  });
  const [editingExercise, setEditingExercise] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch today's exercises on component mount and after any modification
  const fetchExercisesForToday = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(
        "http://localhost:8000/getExercisesForToday",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      console.log(response);
      setExercises(response.data.exercises);
    } catch (error) {
      setError("Failed to fetch exercises for today.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercisesForToday();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddExercise = async () => {
    setLoading(true);
    setError(null);

    try {
      await axios.post("http://localhost:8000/addExercise", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      // Refetch exercises after successful addition
      fetchExercisesForToday();

      // Reset form data and close modal
      closeModal();
    } catch (error) {
      setError("Failed to add exercise.");
    } finally {
      setLoading(false);
    }
  };

  const handleEditExercise = async () => {
    setLoading(true);
    setError(null);

    try {
      await axios.put(
        `http://localhost:8000/editExercise/${editingExercise._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      // Refetch exercises after successful edit
      fetchExercisesForToday();

      // Reset form data and close modal
      closeModal();
    } catch (error) {
      setError("Failed to edit exercise.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExercise = async (exerciseId) => {
    setLoading(true);
    setError(null);

    try {
      await axios.delete(`http://localhost:8000/deleteExercise/${exerciseId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      // Refetch exercises after successful deletion
      fetchExercisesForToday();
    } catch (error) {
      setError("Failed to delete exercise.");
    } finally {
      setLoading(false);
    }
  };

  const openModal = (exercise = null) => {
    if (exercise) {
      setEditingExercise(exercise);
      setFormData({
        exerciseName: exercise.exercises[0].exerciseName,
        muscleGroup: exercise.exercises[0].muscleGroup,
        duration: exercise.exercises[0].duration,
      });
    } else {
      setEditingExercise(null);
      setFormData({
        exerciseName: "",
        muscleGroup: "",
        duration: "",
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExercise(null);
    setFormData({
      exerciseName: "",
      muscleGroup: "",
      duration: "",
    });
  };

  return (
    <div className="p-6">
      <p className="text-s text-purple-400 font-semibold mb-4">The data for Exercises performed  is/will be extracted from <span className='hover:text-purple-500 underline'><a href="https://www.nutritionix.com/">NutritionX : Largest verified Nutrition Database.</a></span></p>
      <h2 className="text-2xl font-bold mb-4">Add/Edit Exercise</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {exercises.map((exercise) => (
              <tr key={exercise._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {exercise.exercises[0].exerciseName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {exercise.exercises[0].muscleGroup}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {exercise.exercises[0].duration}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {exercise.exercises[0].caloriesBurned}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => openModal(exercise)}
                    className="text-white bg-blue-500 px-4 py-2 rounded-lg mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteExercise(exercise._id)}
                    className="text-white bg-red-500 px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex flex-row justify-center items-center w-full">
        <button
          onClick={() => openModal()}
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4 mt-5"
        >
          Add Exercise
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h3 className="text-lg font-medium mb-4">
          {editingExercise ? "Edit Exercise" : "Add Exercise"}
        </h3>
        <form
          className="border-2 rounded-lg px-2 py-2 border-black m-4"
          onSubmit={(e) => {
            e.preventDefault();
            editingExercise ? handleEditExercise() : handleAddExercise();
          }}
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Exercise Name
            </label>
            <input
              type="text"
              name="exerciseName"
              value={formData.exerciseName}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border-2  h-8 "
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Muscle Group
            </label>
            <input
              type="text"
              name="muscleGroup"
              value={formData.muscleGroup}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border-2  h-8 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block b text-sm font-medium text-gray-700">
              Duration (min)
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className="mt-1 block w-full px-2 py-2 border-2 rounded-md shadow-sm h-8 sm:text-sm "
            />
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {editingExercise ? "Update Exercise" : "Add Exercise"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ExerciseForm;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from './Modal'; // Assuming you have a Modal component

const FoodForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [foodEntries, setFoodEntries] = useState([]);
  const [formData, setFormData] = useState({
    foodName: '',
    quantity: '',
  });
  const [editingFoodEntry, setEditingFoodEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch today's food entries on component mount and after any modification
  const fetchFoodEntriesForToday = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get('http://localhost:8000/getFoodEntriesForToday', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      setFoodEntries(response.data.foodEntries);
    } catch (error) {
      setError('Failed to fetch food entries for today.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoodEntriesForToday();
  }, []);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddFoodEntry = async () => {
    setLoading(true);
    setError(null);

    try {
      await axios.post('http://localhost:8000/addCalorieIntake', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      // Refetch food entries after successful addition
      fetchFoodEntriesForToday();

      // Reset form data and close modal
      closeModal();
    } catch (error) {
      setError('Failed to add food entry.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditFoodEntry = async () => {
    setLoading(true);
    setError(null);

    try {
      await axios.put(`http://localhost:8000/updateCalorieIntake/${editingFoodEntry._id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      // Refetch food entries after successful edit
      fetchFoodEntriesForToday();

      // Reset form data and close modal
      closeModal();
    } catch (error) {
      setError('Failed to edit food entry.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFoodEntry = async (foodEntryId) => {
    setLoading(true);
    setError(null);

    try {
      await axios.delete(`http://localhost:8000/deleteCalorieIntake/${foodEntryId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      // Refetch food entries after successful deletion
      fetchFoodEntriesForToday();
    } catch (error) {
      setError('Failed to delete food entry.');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (foodEntry = null) => {
    if (foodEntry) {
      setEditingFoodEntry(foodEntry);
      setFormData({
        foodName: foodEntry.foodName,
        quantity: foodEntry.quantity,
      });
    } else {
      setEditingFoodEntry(null);
      setFormData({
        foodName: '',
        quantity: '',
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingFoodEntry(null);
    setFormData({
      foodName: '',
      quantity: '',
    });
  };

  return (
    <div className="p-6">
      <p className="text-s text-purple-400 font-semibold mb-4">The data for food items consumed is/will be extracted from <span className='hover:text-purple-500 underline'><a href="https://www.nutritionix.com/">NutritionX : Largest verified Nutrition Database.</a></span></p>
      <h2 className="text-2xl font-bold mb-4">Add/Edit Food Entry</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {foodEntries.map((foodEntry) => (
              <tr key={foodEntry._id}>
                <td className="px-6 py-4 whitespace-nowrap">{foodEntry.foodName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{foodEntry.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap">{foodEntry.fat}</td>
                <td className="px-6 py-4 whitespace-nowrap">{foodEntry.protein}</td>
                <td className="px-6 py-4 whitespace-nowrap">{foodEntry.carbs}</td>
                <td className="px-6 py-4 whitespace-nowrap">{foodEntry.calories}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => openModal(foodEntry)}
                    className="text-white bg-blue-500 px-4 py-2 rounded-lg mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteFoodEntry(foodEntry._id)}
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
          Add Food Entry
        </button>
      </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h3 className="text-lg font-medium mb-4">
          {editingFoodEntry ? 'Edit Food Entry' : 'Add Food Entry'}
        </h3>
        <form
          className="border-2 rounded-lg px-2 py-2 border-black m-4"
          onSubmit={(e) => {
            e.preventDefault();
            editingFoodEntry ? handleEditFoodEntry() : handleAddFoodEntry();
          }}
        >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Food Name</label>
            <input
              type="text"
              name="foodName"
              value={formData.foodName}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border-2  h-8"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Quantity</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleInputChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border-2  h-8"
            />
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {editingFoodEntry ? 'Update Food Entry' : 'Add Food Entry'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FoodForm;
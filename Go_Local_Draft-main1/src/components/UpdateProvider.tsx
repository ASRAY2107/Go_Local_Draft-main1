// src/components/UpdateProvider.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Provider, Services } from './exportTypes'; // Import both Provider and Services types
import { AlertTriangle, CheckCircle, Edit, Save, XCircle } from 'lucide-react';

interface UpdateProviderProps {
  provider: Provider; // The provider object to be updated
  onUpdateSuccess: (updatedProvider: Provider) => void; // Callback after successful update
  onCancel: () => void; // Callback for when the user cancels
}

const UpdateProvider: React.FC<UpdateProviderProps> = ({ provider, onUpdateSuccess, onCancel }) => {
  const [formData, setFormData] = useState<Provider>(provider);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);

  useEffect(() => {
    setFormData(provider);
    setProfilePictureFile(null); // Clear any pending file selection
    setError(null);
    setSuccess(null);
  }, [provider]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError(null);
    setSuccess(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    setProfilePictureFile(file);
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Basic validation for required fields
    if (
      !formData.providerName ||
      !formData.location ||
      !formData.mobileNumber ||
      !formData.email ||
      !formData.rating ||
      !formData.experience ||
      !formData.description
    ) {
      setError("Provider Name, Location, Mobile Number, Email, Rating, Experience, and Description are required.");
      setLoading(false);
      return;
    }

    try {
      const dataToSend: any = { ...formData };

      if (profilePictureFile) {
        const reader = new FileReader();
        reader.readAsDataURL(profilePictureFile);
        await new Promise<void>((resolve, reject) => {
          reader.onloadend = () => {
            const base64StringWithPrefix = reader.result as string;
            dataToSend.profilePicture = base64StringWithPrefix.split(',')[1];
            resolve();
          };
          reader.onerror = (errorEvent) => {
            console.error("FileReader error:", errorEvent);
            setError("Failed to read profile picture file. Please try another image.");
            setLoading(false);
            reject(errorEvent);
          };
        });
        if (error) return;
      } else {
        dataToSend.profilePicture = formData.profilePicture;
      }

      // Ensure mobileNumber and rating are sent as strings if your backend expects them that way
      dataToSend.mobileNumber = String(dataToSend.mobileNumber);
      dataToSend.rating = String(dataToSend.rating); // Assuming rating can be a numeric string like "4.5"

      // No direct editing of service fields through text inputs here.
      // The whole 'service' object will be sent as is.
      // If you need to change the service, a more complex selection UI would be required.

      const response = await axios.put<Provider>(
        `http://localhost:8080/api/admin/update-provider/${formData.username}`, // Use username for update API
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setSuccess(`Provider '${response.data.providerName}' updated successfully!`);
      onUpdateSuccess(response.data);

    } catch (err: any) {
      console.error("Error updating provider:", err);
      setError(err.response?.data?.message || err.message || "Failed to update provider. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
        <Edit className="h-6 w-6 mr-2 text-blue-600" /> Update Provider Details
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username (Read-only) */}
        <div>
          <label htmlFor="providerUsername" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="providerUsername"
            name="username"
            value={formData.username}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 text-gray-600 cursor-not-allowed sm:text-sm"
            readOnly
          />
        </div>

        {/* Provider Name */}
        <div>
          <label htmlFor="providerName" className="block text-sm font-medium text-gray-700">
            Provider Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="providerName"
            name="providerName"
            value={formData.providerName}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Location */}
        <div>
          <label htmlFor="providerLocation" className="block text-sm font-medium text-gray-700">
            Location <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="providerLocation"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Mobile Number */}
        <div>
          <label htmlFor="providerMobileNumber" className="block text-sm font-medium text-gray-700">
            Mobile Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text" // Keep as text to allow flexible input, but validate pattern
            id="providerMobileNumber"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
            pattern="[0-9]{10,15}"
            title="Mobile number should contain only digits (e.g., 10-15 characters)"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label htmlFor="providerEmail" className="block text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="providerEmail"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Rating */}
        <div>
          <label htmlFor="providerRating" className="block text-sm font-medium text-gray-700">
            Rating <span className="text-red-500">*</span>
          </label>
          <input
            type="text" // Assuming it can be "4.5", "5 stars" etc. If strictly numeric, change to "number".
            id="providerRating"
            name="rating"
            value={formData.rating}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Experience */}
        <div>
          <label htmlFor="providerExperience" className="block text-sm font-medium text-gray-700">
            Experience (Years) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            id="providerExperience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="providerDescription" className="block text-sm font-medium text-gray-700">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="providerDescription"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            required
          />
        </div>

        {/* Read-only fields for service and booking counts */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Service Name
          </label>
          <input
            type="text"
            value={formData.service?.serviceName || 'N/A'}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 text-gray-600 cursor-not-allowed sm:text-sm"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Number of Bookings
          </label>
          <input
            type="text"
            value={formData.noOfBookings}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 text-gray-600 cursor-not-allowed sm:text-sm"
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Times Booked
          </label>
          <input
            type="text"
            value={formData.noOfTimesBooked}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 text-gray-600 cursor-not-allowed sm:text-sm"
            readOnly
          />
        </div>


        {/* Profile Picture */}
        <div>
          <label htmlFor="providerProfilePicture" className="block text-sm font-medium text-gray-700">
            Profile Picture
          </label>
          {formData.profilePicture && !profilePictureFile && (
            <div className="mt-2 mb-2">
              <span className="text-sm text-gray-600">Current Picture:</span>
              <img
                src={`data:image/jpeg;base64,${formData.profilePicture}`}
                alt="Current Profile"
                className="w-20 h-20 rounded-full object-cover mt-1 border border-gray-200"
              />
            </div>
          )}
          <input
            type="file"
            id="providerProfilePicture"
            name="profilePicture"
            onChange={handleFileChange}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            accept="image/*"
          />
          <p className="mt-1 text-xs text-gray-500">
            Select a new image to update the profile picture.
          </p>
        </div>

        {/* Status Messages (Error/Success) */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <AlertTriangle className="inline h-4 w-4 mr-2" />
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <CheckCircle className="inline h-4 w-4 mr-2" />
            <span className="block sm:inline">{success}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            <XCircle className="h-4 w-4 mr-2" /> Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-4 w-4 mr-2" /> {loading ? 'Updating...' : 'Update Provider'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProvider;
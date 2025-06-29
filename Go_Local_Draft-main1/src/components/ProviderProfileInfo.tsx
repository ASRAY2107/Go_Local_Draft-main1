// src/components/ProviderProfileInfo.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
// Import all necessary icons
import { User, MapPin, Phone, Mail, Star, Briefcase, TrendingUp, CheckCircle, Edit, Save, XCircle, AlertTriangle } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8080/api'; // Your backend base URL

// Interface for provider data - ALIGNED WITH YOUR UpdateProviderRequest DTO
// Assuming profilePicture is stored as a base64 string on the frontend after fetch,
// or a URL if the backend handles that distinction. Given UpdateProvider.tsx,
// it implies a base64 string (without prefix) is sent to backend for profilePicture updates.
interface Provider {
    username: string;
    providerName: string;
    location: string;
    mobileNumber: string; // Stored as string for input handling, converted to number for payload
    email: string;
    profilePicture: string; // This will hold the base64 string (without prefix)
    service: {
        serviceId: string;
        serviceName: string;
    };
    experience: number;
    description: string;
    rating: string; // For display, not directly editable by provider
    noOfBookings: number; // For display, not editable
    noOfTimesBooked: number; // For display, not editable
}

const ProviderProfileInfo: React.FC = () => {
    const [providerData, setProviderData] = useState<Provider | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null); // State for success messages
    const username = localStorage.getItem('username'); // Get username from localStorage

    const [isEditing, setIsEditing] = useState(false);
    // Use an editable form data state, initially populated from providerData
    const [editedFormData, setEditedFormData] = useState<Partial<Provider>>({});
    const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null); // For new image upload

    // Effect to fetch provider data on component mount or username change
    useEffect(() => {
        const fetchProviderData = async () => {
            if (!username) {
                setError("Username not found. Please log in.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            setSuccessMessage(null); // Clear messages on new fetch
            try {
                const res = await axios.get<Provider>(
                    `${API_BASE_URL}/provider/get-profile/${username}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('token')}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                setProviderData(res.data);
                // Initialize editedFormData with current profile values
                setEditedFormData({
                    username: res.data.username,
                    providerName: res.data.providerName,
                    location: res.data.location,
                    mobileNumber: String(res.data.mobileNumber), // Ensure it's string for input
                    email: res.data.email,
                    profilePicture: res.data.profilePicture, // Assuming this is base64
                    experience: res.data.experience,
                    description: res.data.description,
                });
                setProfilePictureFile(null); // Clear any previous file selection
            } catch (err: any) {
                console.error('Failed to fetch provider data:', err);
                setError(err.response?.data?.message || 'Failed to load provider data. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProviderData();
    }, [username]);

    // Handle changes in editable form fields
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditedFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(null); // Clear error on input change
        setSuccessMessage(null); // Clear success on input change
    };

    // Handle file input change for profile picture
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files ? e.target.files[0] : null;
        setProfilePictureFile(file);
        setError(null); // Clear error on file change
        setSuccessMessage(null); // Clear success on file change
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent default form submission behavior
        setLoading(true);
        setError(null);
        setSuccessMessage(null);

        // Basic client-side validation for required fields
        if (
            !editedFormData.providerName ||
            !editedFormData.location ||
            !editedFormData.mobileNumber ||
            !editedFormData.email ||
            !editedFormData.description ||
            editedFormData.experience === undefined ||
            editedFormData.experience < 0
        ) {
            setError("Provider Name, Location, Mobile Number, Email, Experience (must be non-negative), and Description are required.");
            setLoading(false);
            return;
        }

        // Validate mobile number format
        const mobileNumberPattern = /^[0-9]{10,15}$/; // Example: 10 to 15 digits
        if (!mobileNumberPattern.test(editedFormData.mobileNumber)) {
            setError("Mobile number must be 10-15 digits long and contain only numbers.");
            setLoading(false);
            return;
        }

        const dataToSend: any = { ...editedFormData };

        try {
            // Handle profile picture conversion if a new file is selected
            if (profilePictureFile) {
                const reader = new FileReader();
                reader.readAsDataURL(profilePictureFile);
                await new Promise<void>((resolve, reject) => {
                    reader.onloadend = () => {
                        const base64StringWithPrefix = reader.result as string;
                        // Extract only the base64 part (without "data:image/jpeg;base64,")
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
                if (error) return; // Exit if FileReader error occurred
            } else {
                // If no new file, retain the existing profile picture (assuming it's a base64 string)
                dataToSend.profilePicture = providerData?.profilePicture || null;
            }

            // Convert mobileNumber and experience to numbers for the DTO
            dataToSend.mobileNumber = parseInt(editedFormData.mobileNumber, 10);
            dataToSend.experience = Number(editedFormData.experience);

            // Ensure service object is included, but not modified by this form
            dataToSend.service = providerData?.service;

            // Remove non-updatable fields from the payload as they are server-managed
            delete dataToSend.rating;
            delete dataToSend.noOfBookings;
            delete dataToSend.noOfTimesBooked;

            const res = await axios.put(
                `${API_BASE_URL}/provider/update-provider/${username}`,
                dataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            // Re-fetch data to ensure all backend-derived fields (like profile picture URL if it changes) are fresh
            const updatedProviderRes = await axios.get<Provider>(
                `${API_BASE_URL}/provider/get-profile/${username}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            setProviderData(updatedProviderRes.data);
            // Re-initialize editedFormData from the fresh data
            setEditedFormData({
                username: updatedProviderRes.data.username,
                providerName: updatedProviderRes.data.providerName,
                location: updatedProviderRes.data.location,
                mobileNumber: String(updatedProviderRes.data.mobileNumber),
                email: updatedProviderRes.data.email,
                profilePicture: updatedProviderRes.data.profilePicture,
                experience: updatedProviderRes.data.experience,
                description: updatedProviderRes.data.description,
            });
            setProfilePictureFile(null); // Clear file input after successful upload

            setSuccessMessage(`Profile updated successfully!`);
            setIsEditing(false); // Exit edit mode
        } catch (err: any) {
            console.error('Failed to update profile:', err);
            if (err.response && err.response.data) {
                // Attempt to extract specific error messages from backend response
                if (typeof err.response.data === 'object' && !Array.isArray(err.response.data)) {
                    const errorMessages = Object.values(err.response.data).flat().join('\n');
                    setError(`Update failed: ${errorMessages}`);
                } else if (typeof err.response.data === 'string') {
                    setError(err.response.data);
                } else {
                    setError(err.response.data.message || 'Failed to update profile. Please try again.');
                }
            } else {
                setError(err.message || 'Failed to update profile. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        // Reset editedFormData to original providerData
        if (providerData) {
            setEditedFormData({
                username: providerData.username,
                providerName: providerData.providerName,
                location: providerData.location,
                mobileNumber: String(providerData.mobileNumber),
                email: providerData.email,
                profilePicture: providerData.profilePicture,
                experience: providerData.experience,
                description: providerData.description,
            });
        }
        setProfilePictureFile(null); // Clear any selected file
        setError(null); // Clear errors
        setSuccessMessage(null); // Clear success message
    };

    if (loading && !providerData) { // Show loading only if data hasn't been fetched yet
        return <div className="text-center text-gray-600 p-8">Loading profile...</div>;
    }

    if (error && !providerData) { // Show error only if there's no data to display
        return <div className="text-center text-red-600 p-8">{error}</div>;
    }

    if (!providerData) {
        return <div className="text-center text-gray-600 p-8">No provider data available.</div>;
    }

    return (
        <div className="bg-white rounded-xl p-6 shadow-md space-y-6 max-w-2xl mx-auto">
            <form onSubmit={handleSaveProfile}> {/* Wrap content in a form */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-2xl font-bold text-gray-900">Your Profile Information</h3>
                    {!isEditing && (
                        <button
                            type="button" // Important: type="button" prevents accidental form submission
                            onClick={() => setIsEditing(true)}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        >
                            <Edit className="h-5 w-5" />
                            <span>Edit Profile</span>
                        </button>
                    )}
                </div>

                {/* Status Messages (Error/Success) */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <AlertTriangle className="inline h-4 w-4 mr-2" />
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                        <CheckCircle className="inline h-4 w-4 mr-2" />
                        <span className="block sm:inline">{successMessage}</span>
                    </div>
                )}

                <div className="flex items-center space-x-6 mb-6">
                    <img
                        src={
                            profilePictureFile
                                ? URL.createObjectURL(profilePictureFile) // Show preview of new file
                                : (providerData.profilePicture ? `data:image/jpeg;base64,${providerData.profilePicture}` : "https://via.placeholder.com/150") // Show existing base64 or placeholder
                        }
                        alt="Profile"
                        className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 shadow-lg"
                    />
                    <div>
                        <h4 className="text-xl font-semibold text-gray-900">
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="providerName"
                                    value={editedFormData.providerName || ''}
                                    onChange={handleChange}
                                    className="border rounded px-2 py-1 text-xl font-semibold w-full"
                                    required
                                />
                            ) : providerData.providerName}
                        </h4>
                        <p className="text-gray-600 flex items-center mt-1">
                            <User className="h-4 w-4 mr-1 text-gray-500" />
                            {providerData.username} <span className="text-xs text-gray-500 ml-1">(Read-only)</span>
                        </p>
                        <p className="text-gray-600 flex items-center">
                            <Star className="h-4 w-4 mr-1 text-yellow-500" />
                            Rating: {providerData.rating || 'N/A'} ({providerData.noOfBookings} bookings) <span className="text-xs text-gray-500 ml-1">(Read-only)</span>
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                    <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2 text-blue-500" />
                        <p><strong>Location:</strong> {isEditing ? (
                            <input
                                type="text"
                                name="location"
                                value={editedFormData.location || ''}
                                onChange={handleChange}
                                className="border rounded px-2 py-1 w-full"
                                required
                            />
                        ) : providerData.location}</p>
                    </div>
                    <div className="flex items-center">
                        <Phone className="h-5 w-5 mr-2 text-blue-500" />
                        <p><strong>Mobile:</strong> {isEditing ? (
                            <input
                                type="text" // Keep as text to allow flexible input, but validate pattern
                                name="mobileNumber"
                                value={editedFormData.mobileNumber || ''}
                                onChange={handleChange}
                                className="border rounded px-2 py-1 w-full"
                                pattern="[0-9]{10,15}"
                                title="Mobile number must be 10-15 digits long and contain only numbers."
                                required
                            />
                        ) : providerData.mobileNumber}</p>
                    </div>
                    <div className="flex items-center">
                        <Mail className="h-5 w-5 mr-2 text-blue-500" />
                        <p><strong>Email:</strong> {isEditing ? (
                            <input
                                type="email"
                                name="email"
                                value={editedFormData.email || ''}
                                onChange={handleChange}
                                className="border rounded px-2 py-1 w-full"
                                required
                            />
                        ) : providerData.email || 'N/A'}</p>
                    </div>
                    <div className="flex items-center">
                        <Briefcase className="h-5 w-5 mr-2 text-blue-500" />
                        <p><strong>Occupation:</strong> {providerData.service?.serviceName || 'N/A'} <span className="text-xs text-gray-500 ml-1">(Read-only)</span></p>
                    </div>
                    <div className="flex items-center">
                        <Star className="h-5 w-5 mr-2 text-blue-500" />
                        <p><strong>Experience:</strong> {isEditing ? (
                            <input
                                type="number"
                                name="experience"
                                value={editedFormData.experience === undefined ? '' : editedFormData.experience}
                                onChange={handleChange}
                                min="0"
                                max="50"
                                className="border rounded px-2 py-1 w-20"
                                required
                            />
                        ) : providerData.experience} years</p>
                    </div>
                     {isEditing && (
                        <div>
                            <label htmlFor="profilePictureInput" className="block text-sm font-medium text-gray-700 mt-2">
                                Update Profile Picture
                            </label>
                            <input
                                type="file"
                                id="profilePictureInput"
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
                    )}
                </div>

                <div className="mt-4">
                    <h4 className="text-lg font-semibold text-gray-900">About Me:</h4>
                    <p className="text-gray-700 mt-2">{isEditing ? (
                        <textarea
                            name="description"
                            value={editedFormData.description || ''}
                            onChange={handleChange}
                            rows={4}
                            className="border rounded w-full p-2"
                            required
                        />
                    ) : providerData.description || 'No description provided.'}</p>
                </div>

                {isEditing && (
                    <div className="mt-6 flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            <XCircle className="h-4 w-4 mr-2" /> Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save className="h-4 w-4 mr-2" /> {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                )}
            </form>

            <div className="mt-6 border-t pt-6">
                <h4 className="text-lg font-semibold text-gray-900">Key Metrics</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="bg-gray-100 p-4 rounded-lg shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Bookings</p>
                            <p className="text-xl font-bold text-gray-900">{providerData.noOfBookings}</p>
                        </div>
                        <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                    <div className="bg-gray-100 p-4 rounded-lg shadow-sm flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Times Booked</p>
                            <p className="text-xl font-bold text-gray-900">{providerData.noOfTimesBooked}</p>
                        </div>
                        <TrendingUp className="h-8 w-8 text-blue-500" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProviderProfileInfo;
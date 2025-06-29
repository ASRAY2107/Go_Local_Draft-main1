// src/components/ProviderDashboard.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Calendar, Award, LogOut, LayoutDashboard } from 'lucide-react'; // Added LayoutDashboard for dashboard icon

// Import the tab content components

import ProviderProfileInfo from '../components/ProviderProfileInfo';
import ProviderBookingRequests from '../components/ProviderBookingRequests';
 // Import the rating modal component
// ProviderRatingCustomer is used as a modal inside ProviderBookingRequests, so no direct import here for a tab content.

const API_BASE_URL = 'http://localhost:8080/api'; // Your backend base URL

// Define the possible tabs
type DashboardTab = 'profileInfo' | 'bookingRequests' | 'ratingCustomers';

const ProviderDashboard: React.FC = () => {
    // State for managing active tab
    const [activeTab, setActiveTab] = useState<DashboardTab>('profileInfo'); // Default to 'profileInfo'
    const navigate = useNavigate();

    // Basic authentication check
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token ) {
            console.warn("Authentication failed or role mismatch. Redirecting to login.");
            navigate('/auth'); // Redirect to login if not authenticated or not a provider
        }
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
        } catch (error) {
            console.error('Logout API might have failed, but clearing local storage:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('userRole');
            localStorage.removeItem('username');
            navigate('/auth'); // Redirect to login page
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col">
            {/* Header / Navbar */}
            <header className="bg-blue-600 text-white p-4 shadow-md">
                <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
                    <h1 className="text-2xl font-bold mb-2 sm:mb-0 flex items-center space-x-2">
                        <LayoutDashboard className="h-7 w-7" />
                        <span>Provider Dashboard</span>
                    </h1>
                    <nav className="w-full sm:w-auto">
                        <ul className="flex justify-around sm:justify-end space-x-2 sm:space-x-6 text-sm sm:text-base">
                            <li>
                                <button
                                    onClick={() => setActiveTab('profileInfo')}
                                    className={`flex items-center space-x-1 p-2 rounded-md transition-colors ${
                                        activeTab === 'profileInfo' ? 'bg-blue-700 font-semibold' : 'hover:bg-blue-500'
                                    }`}
                                >
                                    <User className="h-5 w-5" />
                                    <span>Profile Info</span>
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setActiveTab('bookingRequests')}
                                    className={`flex items-center space-x-1 p-2 rounded-md transition-colors ${
                                        activeTab === 'bookingRequests' ? 'bg-blue-700 font-semibold' : 'hover:bg-blue-500'
                                    }`}
                                >
                                    <Calendar className="h-5 w-5" />
                                    <span>Booking Requests</span>
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={() => setActiveTab('ratingCustomers')}
                                    className={`flex items-center space-x-1 p-2 rounded-md transition-colors ${
                                        activeTab === 'ratingCustomers' ? 'bg-blue-700 font-semibold' : 'hover:bg-blue-500'
                                    }`}
                                >
                                    <Award className="h-5 w-5" />
                                    <span>Rate Customers</span>
                                </button>
                            </li>
                            <li>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center space-x-1 p-2 rounded-md bg-red-500 hover:bg-red-600 transition-colors"
                                >
                                    <LogOut className="h-5 w-5" />
                                    <span>Logout</span>
                                </button>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>

            {/* Main Content Area - Renders the active tab's component */}
            <main className="container mx-auto p-4 py-8 flex-grow">
                {activeTab === 'profileInfo' && <ProviderProfileInfo />}
                {activeTab === 'bookingRequests' && <ProviderBookingRequests />}
                {activeTab === 'ratingCustomers' && (
                    <div className="bg-white rounded-xl p-6 shadow-md">
                        <h3 className="text-2xl font-bold text-gray-900 mb-4">Rate Your Customers</h3>
                        <p className="text-gray-700 mb-4">
                            To rate a customer, navigate to the **Booking Requests** tab. Once a booking is marked as "Completed," you will find an option to "Rate Customer" next to that specific booking.
                        </p>
                        <p className="text-gray-700">
                            This approach ensures that customer ratings are directly linked to completed services.
                        </p>
                         <button
                            onClick={() => setActiveTab('bookingRequests')}
                            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
                        >
                            <Calendar className="h-5 w-5" />
                            <span>Go to Booking Requests</span>
                        </button>
                    </div>
                )}
            </main>

            {/* Footer (Optional) */}
            <footer className="bg-gray-800 text-white text-center p-4 mt-auto">
                <p>&copy; {new Date().getFullYear()} GoLocal Services. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default ProviderDashboard;
// src/pages/ServiceDetailPage.tsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import ErrorMessage from '../components/Common/ErrorMessage';
import BookServiceForm from '../components/CustomerDashboard/BookServiceForm';
import { Service } from '../types/service.d'; // Use the main Service interface from types

const ServiceDetailPage: React.FC = () => {
    const { serviceId } = useParams<{ serviceId: string }>();
    const navigate = useNavigate();
    const { getAllServices } = useAuth(); // Assuming this fetches all services

    const [serviceDetails, setServiceDetails] = useState<Service | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showBookingForm, setShowBookingForm] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!serviceId) {
                setError("No service ID provided in the URL.");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            setServiceDetails(null); // Clear previous details

            try {
                const fetchedServices: any[] | null = await getAllServices();

                if (fetchedServices) {
                    const foundService = fetchedServices.find((s: any) => s.serviceId === serviceId);

                    if (foundService) {
                        const parsedPrice = parseFloat(foundService.price);
                        if (isNaN(parsedPrice)) {
                            console.warn(`Service ID ${serviceId}: Price '${foundService.price}' is not a valid number. Defaulting to 0.`);
                        }

                        const mappedService: Service = {
                            id: foundService.serviceId,
                            name: foundService.serviceName,
                            description: foundService.description || "No description available.",
                            imageUrl: foundService.imageUrl,
                            price: isNaN(parsedPrice) ? 0 : parsedPrice,
                            providerId: foundService.providerId,
                            providerName: foundService.providerName,
                            providerRating: foundService.rating, // Service rating




                            // NEW: Map provider details from backend response
                            providerDescription: foundService.providerDescription,
                            providerLocation: undefined,
                            providerMobileNumber: undefined
                        };
                        console.log("Found Service (from backend):", foundService); // Check raw backend data here
                        console.log("Mapped Service (for frontend state):", mappedService); // Check what's going into state here

                        setServiceDetails(mappedService);
                    } else {
                        setError(`Service with ID "${serviceId}" not found.`);
                    }
                } else {
                    setError("Failed to load services data or no services available.");
                }
            } catch (err) {
                console.error("Error fetching service details:", err);
                setError("Could not load service details. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [serviceId, getAllServices]);

    const handleBookingSuccess = () => {
        alert("Service request sent successfully!");
        setShowBookingForm(false);
        navigate('/customer-dashboard');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <LoadingSpinner message="Loading service details..." />
            </div>
        );
    }

    if (error) {
        return (
            <div className="py-24 text-center">
                <ErrorMessage message={error} />
                <button onClick={() => navigate('/services')} className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md text-lg hover:bg-blue-700 transition duration-200">
                    Back to All Services
                </button>
            </div>
        );
    }

    if (!serviceDetails) {
        return (
            <div className="py-24 text-center text-gray-700">
                <p>Service details could not be loaded. Please check the URL or try again.</p>
                <button onClick={() => navigate('/services')} className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-md text-lg hover:bg-blue-700 transition duration-200">
                    Back to All Services
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 lg:p-12 min-h-screen">
            <h1 className="text-5xl md:text-6xl font-extrabold text-center text-gray-900 mb-10 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-800">
                {serviceDetails.name}
            </h1>

            <div className="bg-white rounded-xl shadow-lg p-8 mb-8 flex flex-col md:flex-row items-center md:items-start gap-8">
                {serviceDetails.imageUrl && (
                    <div className="w-full md:w-1/3 flex-shrink-0">
                        <img
                            src={serviceDetails.imageUrl}
                            alt={serviceDetails.name}
                            className="w-full h-auto object-cover rounded-md shadow-md"
                        />
                    </div>
                )}
                <div className="flex-grow">
                    <p className="text-gray-700 text-lg mb-4 leading-relaxed">{serviceDetails.description}</p>
                    <p className="text-lg font-semibold text-indigo-700 mb-2">
                        Price: ${typeof serviceDetails.price === 'number' && !isNaN(serviceDetails.price) ? serviceDetails.price.toFixed(2) : 'N/A'}
                    </p>
                    <p className="text-md text-gray-600 mb-2">Service ID: {serviceDetails.id}</p>
                    <p className="text-md text-gray-600 mb-2">Service ID: {serviceDetails.name}</p>
                    <p className="text-md text-gray-600 mb-2">Provider ID: {serviceDetails.providerId || 'N/A'}</p>
                    <p className="text-md text-gray-600 mb-2">Provider Name: {serviceDetails.providerName || 'N/A'}</p>
                    {/* <p className="text-md text-gray-600 mb-4">Service Rating: {serviceDetails.rating ? `${serviceDetails.rating.toFixed(1)}/5` : 'No ratings yet'}</p> */}

                    {/* NEW: Display Provider's Rating and Description */}
                    <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">About the Provider</h3>
                    {serviceDetails.providerRating !== undefined && serviceDetails.providerRating !== null && (
                        <p className="text-md text-gray-600 mb-2">Provider Rating: {serviceDetails.providerRating.toFixed(1)}/5</p>
                    )}
                    {serviceDetails.providerDescription && (
                        <p className="text-gray-700 text-base leading-relaxed">{serviceDetails.providerDescription}</p>
                    )}
                    {!serviceDetails.providerDescription && !serviceDetails.providerRating && (
                         <p className="text-gray-600 text-base">No additional provider details available.</p>
                    )}

                    {!showBookingForm ? (
                        <button
                            onClick={() => setShowBookingForm(true)}
                            className="mt-6 w-full md:w-auto px-8 py-3 bg-indigo-600 text-white rounded-md text-xl font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200"
                        >
                            Book Now
                        </button>
                    ) : (
                        <p className="text-center text-gray-600 mt-4">Fill the form below to book.</p>
                    )}
                </div>
            </div>

            {showBookingForm && (
                <div className="mt-8">
                    <BookServiceForm
                        initialProviderId={serviceDetails.providerId}
                        initialBookingAmount={serviceDetails.price?.toString() || ''}
                        onServiceBooked={handleBookingSuccess}
                    />
                    <button
                        onClick={() => setShowBookingForm(false)}
                        className="mt-4 w-full md:w-auto px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition duration-200"
                    >
                        Cancel Booking
                    </button>
                </div>
            )}
        </div>
    );
};

export default ServiceDetailPage;
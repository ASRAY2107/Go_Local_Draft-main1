import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Service } from './SignupHelper/Service'; // Adjust path if your Service interface is elsewhere

interface ServiceDropdownProps {
  // You can add props here if this component needs to receive any data or callbacks
  // For now, it's self-contained, so no props are defined.
}

const ServiceDropdown: React.FC<ServiceDropdownProps> = () => {
  // State for services, explicitly typed as an array of Service objects
  const [services, setServices] = useState<Service[]>([]);
  // State for loading status, explicitly typed as boolean
  const [loading, setLoading] = useState<boolean>(true);
  // State for error, explicitly typed as Error or null
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        // Replace with your actual backend API endpoint
        // axios automatically infers the response data type if possible,
        // but explicitly typing it as Service[] is good practice for clarity.
        const response = await axios.get<Service[]>('YOUR_BACKEND_API_ENDPOINT/services');
        setServices(response.data);
      } catch (err: any) { // Type 'any' for catch block error if you don't use 'unknown'
        setError(err); // axios errors often have a 'message' property
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []); // Empty dependency array means this effect runs once on component mount

  if (loading) {
    return <div>Loading services...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <label htmlFor="service-select">Select a Service:</label>
      <select id="service-select" name="service">
        {services.map((service: Service) => ( // Explicitly type 'service' here
          <option key={service.serviceId} value={service.serviceId}>
            {`${service.serviceId}-${service.serviceName}`}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ServiceDropdown;
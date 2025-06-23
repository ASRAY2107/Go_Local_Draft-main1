import React, { useState, useEffect } from "react";
import { Provider } from "./AdminDashboard";

export type Services = {
  serviceId: string,
  serviceName: string,
  noOfUser: number
}

// Helper to convert Uint8Array to base64 image src
function arrayBufferToBase64(buffer: Uint8Array) {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

// Helper to convert Uint8Array to text for description
function uint8ToString(uint8: Uint8Array) {
  return new TextDecoder().decode(uint8);
}

export function ProviderDashboard() {
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState<string | undefined>();

  // Fetch the username
  useEffect(() => {
    fetch("http://localhost:5173/api/auth/me")
      .then(res => res.json())
      .then(data => {
        setUsername(data.username);
      })
      // .catch(err => {
      //   console.error("Error fetching username:", err);
      //   setLoading(false);
      // });
  }, []);

  // Fetch the provider profile when username is known
  useEffect(() => {
    if (!username) return;
    fetch(`http://localhost:5173/api/provider/get-profile/${username}`)
      .then(res => res.json())
      .then(data => {
        setProvider(data);
        setLoading(false);
      })
      // .catch(err => {
      //   console.error("Error fetching provider:", err);
      //   setLoading(false);
      // });
  }, [username]);

  if (loading) return <div>Loading...</div>;
  if (!provider) return <div>No data found</div>;

  // If provider.service is an object:
  const serviceDisplay = (
    <ul>
      {Object.entries(provider.service).map(([key, value]) => (
        <li key={key}>
          <strong>{key}:</strong> {value as string | number}
        </li>
      ))}
    </ul>
  );

  return (
    <div style={{ border: "1px solid #ccc", padding: 20, maxWidth: 400 }}>
      <img
        alt="Profile"
        src={`data:image/jpeg;base64,${arrayBufferToBase64(provider.profilePicture)}`}
        style={{ width: 100, height: 100, borderRadius: "50%" }}
      />
      <h2>{provider.providerName}</h2>
      <p><b>Username:</b> {provider.username}</p>
      <p><b>Email:</b> {provider.email}</p>
      <p><b>Location:</b> {provider.location}</p>
      <p><b>Mobile:</b> {provider.mobileNumber.toString()}</p>
      <p><b>Rating:</b> {provider.rating}</p>
      <div><b>Service:</b> {serviceDisplay}</div>
      <p><b>Experience:</b> {provider.experience} years</p>
      <p><b>No. of Bookings:</b> {provider.noOfBookings}</p>
      <p><b>No. of Times Booked:</b> {provider.noOfTimesBooked}</p>
      <p><b>Description:</b> {uint8ToString(provider.description)}</p>
    </div>
  );
}
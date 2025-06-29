// src/components/AdminDashboard.tsx
import axios from "axios";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle,
  Clock,
  DollarSign,
  Edit,
  Eye,
  Globe,
  PieChart,
  Plus, // Make sure Plus icon is imported
  Search,
  Settings,
  Shield,
  Star,
  Trash2,
  TrendingUp,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import CreateCustomer from "../components/CreateCustomer";
import CreateProvider from "../components/CreateProvider";
import SearchCustomer from "../components/SearchCustomer";
import SearchProvider from "../components/SearchProvider";
import UpdateCustomer from "../components/UpdateCustomer";
import UpdateProvider from "../components/UpdateProvider";
import DeleteConfirmationModal from "../components/DeleteConfirmation";
import CreateService from "../components/CreateServices"; // NEW: Import CreateService

import { Customer, Provider, Services } from "../components/exportTypes"; // NEW: Import Services type

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("customer");
  const [username, setUsername] = useState<string | undefined>();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // States for customer search
  const [foundCustomer, setFoundCustomer] = useState<Customer | null>(null);
  const [searchCustomerError, setSearchCustomerError] = useState<string | null>(null);
  const [isCustomerSearchActive, setIsCustomerSearchActive] = useState<boolean>(false);

  // States for provider search
  const [foundProvider, setFoundProvider] = useState<Provider | null>(null);
  const [searchProviderError, setSearchProviderError] = useState<string | null>(null);
  const [isProviderSearchActive, setIsProviderSearchActive] = useState<boolean>(false);

  // State for customer update
  const [customerToUpdate, setCustomerToUpdate] = useState<Customer | null>(null);

  // State for provider update
  const [providerToUpdate, setProviderToUpdate] = useState<Provider | null>(null);

  // States for deletion confirmation
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ username: string; type: 'customer' | 'provider'; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  type Users = {
    username: string;
    password: string;
    role: string;
    isDeleted: boolean;
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          'http://localhost:8080/api/auth/me',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              'Content-Type': 'application/json'
            }
          }
        );
        console.log(res.data);
        setUsername(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

  // Fetch all customers only if no customer search is active AND not in update mode
  useEffect(() => {
    const fetchAllCustomers = async () => {
      if (!isCustomerSearchActive && activeTab === "customer" && !customerToUpdate) {
        try {
          const Cusres = await axios.get<Customer[]>(
            'http://localhost:8080/api/admin/get-customers',
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                'Content-Type': 'application/json'
              }
            }
          );
          console.log(Cusres.data);
          setCustomers(Cusres.data);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchAllCustomers();
  }, [isCustomerSearchActive, activeTab, customerToUpdate]);

  console.log("Current Customers:", customers);

  // Fetch all providers only if no provider search is active AND not in update mode
  useEffect(() => {
    const fetchAllProviders = async () => {
      if (!isProviderSearchActive && !providerToUpdate) {
        try {
          const prores = await axios.get<Provider[]>(
            'http://localhost:8080/api/admin/get-providers',
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                'Content-Type': 'application/json'
              }
            }
          );
          console.log(prores.data);
          setProviders(prores.data);
        } catch (err) {
          console.error(err);
        }
      }
    };
    fetchAllProviders();
  }, [isProviderSearchActive, providerToUpdate]);

  console.log("Current Providers:", providers);

  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("All Roles");


  // Callback function to handle new customer creation
  const handleNewCustomerCreated = (newCustomer: Customer) => {
    setCustomers(prevCustomers => [...prevCustomers, newCustomer]);
    setActiveTab("customer");
    setFoundCustomer(null);
    setSearchCustomerError(null);
    setIsCustomerSearchActive(false);
    setCustomerToUpdate(null);
    setSuccess(`Customer '${newCustomer.customerName}' created successfully!`);
    setTimeout(() => setSuccess(null), 3000);
    setError(null); // Clear any error messages from previous attempts
  };

  const handleCreateCustomerCancel = () => {
    setActiveTab("customer");
    setError(null);
    setSuccess(null);
  };

  // Callback function to handle new provider creation
  const handleNewProviderCreated = (newProvider: Provider) => {
    setProviders(prevProviders => [...prevProviders, newProvider]);
    setActiveTab("provider");
    setFoundProvider(null);
    setSearchProviderError(null);
    setIsProviderSearchActive(false);
    setProviderToUpdate(null);
    setSuccess(`Provider '${newProvider.providerName}' created successfully!`);
    setTimeout(() => setSuccess(null), 3000);
    setError(null); // Clear any error messages from previous attempts
  };

  const handleCreateProviderCancel = () => {
    setActiveTab("provider");
    setError(null);
    setSuccess(null);
  };

  // NEW: Callback function to handle new service creation
  const handleNewServiceCreated = (newService: Services) => {
    // If you had a list of services to display, you would update that state here.
    // For now, we'll just show a success message and switch back to a relevant tab.
    setActiveTab("create-service"); // Stay on create tab, or switch to 'customer' or 'provider' if preferred
    setSuccess(`Service '${newService.serviceName}' (ID: ${newService.serviceId}) created successfully!`);
    setTimeout(() => setSuccess(null), 3000);
    setError(null); // Clear any error messages from previous attempts
  };

  const handleCreateServiceCancel = () => {
    setActiveTab("customer"); // Or 'provider' or keep on 'create-service'
    setError(null);
    setSuccess(null);
  };


  // --- SearchCustomer Callbacks ---
  const handleCustomerFound = (customer: Customer | null) => {
    setFoundCustomer(customer);
    setSearchCustomerError(null);
    setCustomerToUpdate(null);
    setError(null); // Clear general error
    setSuccess(null); // Clear general success
  };

  const handleCustomerSearchError = (error: string | null) => {
    setSearchCustomerError(error);
    setFoundCustomer(null);
    setCustomerToUpdate(null);
    setError(null); // Clear general error
    setSuccess(null); // Clear general success
  };

  const handleCustomerSearchActiveChange = (isActive: boolean) => {
    setIsCustomerSearchActive(isActive);
    if (!isActive) {
      setFoundCustomer(null);
      setSearchCustomerError(null);
    }
  };
  // --- End SearchCustomer Callbacks ---

  // --- SearchProvider Callbacks ---
  const handleProviderFound = (provider: Provider | null) => {
    setFoundProvider(provider);
    setSearchProviderError(null);
    setProviderToUpdate(null);
    setError(null); // Clear general error
    setSuccess(null); // Clear general success
  };

  const handleProviderSearchError = (error: string | null) => {
    setSearchProviderError(error);
    setFoundProvider(null);
    setProviderToUpdate(null);
    setError(null); // Clear general error
    setSuccess(null); // Clear general success
  };

  const handleProviderSearchActiveChange = (isActive: boolean) => {
    setIsProviderSearchActive(isActive);
    if (!isActive) {
      setFoundProvider(null);
      setSearchProviderError(null);
    }
  };
  // --- End SearchProvider Callbacks ---

  // --- UpdateCustomer Callbacks ---
  const handleEditCustomer = (customer: Customer) => {
    setCustomerToUpdate(customer);
    setActiveTab("customer");
    setIsCustomerSearchActive(false);
    setFoundCustomer(null);
    setSearchCustomerError(null);
    setSuccess(null);
    setError(null);
  };

  const handleCustomerUpdateSuccess = (updatedCustomer: Customer) => {
    setCustomers(prevCustomers =>
      prevCustomers.map(cust =>
        cust.username === updatedCustomer.username ? updatedCustomer : cust
      )
    );
    setCustomerToUpdate(null);
    setActiveTab("customer");
    setSuccess(`Customer '${updatedCustomer.customerName}' updated successfully!`);
    setTimeout(() => setSuccess(null), 3000);
    setError(null);
  };

  const handleCustomerUpdateCancel = () => {
    setCustomerToUpdate(null);
    setActiveTab("customer");
    setSearchCustomerError(null);
    setFoundCustomer(null);
    setError(null);
    setSuccess(null);
  };
  // --- End UpdateCustomer Callbacks ---

  // --- UpdateProvider Callbacks ---
  const handleEditProvider = (provider: Provider) => {
    setProviderToUpdate(provider);
    setActiveTab("provider");
    setIsProviderSearchActive(false);
    setFoundProvider(null);
    setSearchProviderError(null);
    setSuccess(null);
    setError(null);
  };

  const handleProviderUpdateSuccess = (updatedProvider: Provider) => {
    setProviders(prevProviders =>
      prevProviders.map(prov =>
        prov.username === updatedProvider.username ? updatedProvider : prov
      )
    );
    setProviderToUpdate(null);
    setActiveTab("provider");
    setSuccess(`Provider '${updatedProvider.providerName}' updated successfully!`);
    setTimeout(() => setSuccess(null), 3000);
    setError(null);
  };

  const handleProviderUpdateCancel = () => {
    setProviderToUpdate(null);
    setActiveTab("provider");
    setSearchProviderError(null);
    setFoundProvider(null);
    setError(null);
    setSuccess(null);
  };
  // --- End UpdateProvider Callbacks ---

  // --- Deletion Handlers ---
  const handleDeleteClick = (username: string, type: 'customer' | 'provider', name: string) => {
    setItemToDelete({ username, type, name });
    setShowDeleteConfirmation(true);
    setSuccess(null);
    setError(null);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    setError(null);

    try {
      const { username, type, name } = itemToDelete;
      let deleteEndpoint = '';

      if (type === 'customer') {
        deleteEndpoint = `http://localhost:8080/api/admin/delete-customer/${username}`;
      } else if (type === 'provider') {
        deleteEndpoint = `http://localhost:8080/api/admin/delete-provider/${username}`;
      } else {
        throw new Error('Unknown user type for deletion.');
      }

      await axios.delete(deleteEndpoint, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (type === 'customer') {
        setCustomers(prev => prev.filter(cust => cust.username !== username));
      } else if (type === 'provider') {
        setProviders(prev => prev.filter(prov => prov.username !== username));
      }

      setSuccess(`${name} (${username}) deleted successfully!`);
      setTimeout(() => setSuccess(null), 3000);

    } catch (err: any) {
      console.error("Error deleting user:", err);
      setError(err.response?.data?.message || `Failed to delete ${itemToDelete.name}. Please try again.`);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirmation(false);
      setItemToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
    setItemToDelete(null);
    setIsDeleting(false);
    setError(null);
  };
  // --- End Deletion Handlers ---


  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      case "info":
        return "bg-blue-100 text-blue-800";
      case "success":
        return "bg-green-100 text-green-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      case "error":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "ROLE_CUSTOMER":
        return "bg-blue-100 text-blue-800";
      case "ROLE_PROVIDER":
        return "bg-purple-100 text-purple-800";
      case "ROLE_ADMIN":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={
                "https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=150"
              }
              alt=""
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Admin Dashboard
              </h1>
              <p className="text-gray-600">
                Welcome back {username} ,Manage your platform efficiently
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Shield className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-red-600">
                    Admin
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Globe className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">System Access</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {[
                { id: "customer", label: "Customer", icon: Activity },
                { id: "provider", label: "Provider", icon: BarChart3 },
                { id: "create-customer", label: "Create Customer", icon: Plus },
                { id: "create-provider", label: "Create Provider", icon: Plus },
                { id: "create-service", label: "Create Service", icon: Plus } // NEW: Tab for Create Service
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {/* General Error Message */}
            {error && (
              <div className="flex items-center p-3 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                <AlertTriangle className="flex-shrink-0 inline w-4 h-4 mr-3" />
                <div>{error}</div>
              </div>
            )}

            {/* General Success Message */}
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                <CheckCircle className="inline h-4 w-4 mr-2" />
                <span className="block sm:inline">{success}</span>
              </div>
            )}

            {activeTab === "customer" && (
              <div className="bg-white rounded-lg overflow-hidden">
                {customerToUpdate ? (
                  <UpdateCustomer
                    customer={customerToUpdate}
                    onUpdateSuccess={handleCustomerUpdateSuccess}
                    onCancel={handleCustomerUpdateCancel}
                  />
                ) : (
                  <>
                    <SearchCustomer
                      onCustomerFound={handleCustomerFound}
                      onSearchError={setSearchCustomerError}
                      onSearchActiveChange={handleCustomerSearchActiveChange}
                    />

                    {searchCustomerError && (
                      <div className="flex items-center p-3 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                        <AlertTriangle className="flex-shrink-0 inline w-4 h-4 mr-3" />
                        <div>{searchCustomerError}</div>
                      </div>
                    )}

                    {isCustomerSearchActive && foundCustomer ? (
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Search Result:</h3>
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Username
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Customer Name
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Location
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Mobile Number
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            <tr className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                {foundCustomer.username}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {foundCustomer.customerName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {foundCustomer.location}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {`${foundCustomer.mobileNumber}`}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {foundCustomer.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => handleEditCustomer(foundCustomer)}
                                  className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                                  title="Edit Customer"
                                >
                                  <Edit className="h-4 w-4 mr-1" /> Edit
                                </button>
                                {/* DELETE BUTTON FOR CUSTOMER (TRASH2 ICON) */}
                                <button
                                  onClick={() => handleDeleteClick(foundCustomer.username, 'customer', foundCustomer.customerName)}
                                  className="text-red-600 hover:text-red-900 inline-flex items-center"
                                  title="Delete Customer"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      !isCustomerSearchActive && (
                        <div className="mt-4">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">All Customers:</h3>
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Username
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Customer Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Location
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Mobile Number
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {customers.map((customer, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {customer.username}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {customer.customerName}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {customer.location}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {`${customer.mobileNumber}`}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {customer.email}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center justify-end space-x-2">
                                    <button
                                      onClick={() => handleEditCustomer(customer)}
                                      className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                                      title="Edit Customer"
                                    >
                                      <Edit className="h-4 w-4 mr-1" /> Edit
                                    </button>
                                    {/* DELETE BUTTON FOR CUSTOMER (TRASH2 ICON) */}
                                    <button
                                      onClick={() => handleDeleteClick(customer.username, 'customer', customer.customerName)}
                                      className="text-red-600 hover:text-red-900 inline-flex items-center"
                                      title="Delete Customer"
                                    >
                                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )
                    )}
                  </>
                )}
              </div>
            )}

            {activeTab === "provider" && (
              <>
                {providerToUpdate ? (
                  <UpdateProvider
                    provider={providerToUpdate}
                    onUpdateSuccess={handleProviderUpdateSuccess}
                    onCancel={handleProviderUpdateCancel}
                  />
                ) : (
                  <>
                    <SearchProvider
                      onProviderFound={handleProviderFound}
                      onSearchError={setSearchProviderError}
                      onSearchActiveChange={handleProviderSearchActiveChange}
                    />

                    {searchProviderError && (
                      <div className="flex items-center p-3 mb-4 text-sm text-red-800 rounded-lg bg-red-50" role="alert">
                        <AlertTriangle className="flex-shrink-0 inline w-4 h-4 mr-3" />
                        <div>{searchProviderError}</div>
                      </div>
                    )}

                    {isProviderSearchActive && foundProvider ? (
                      <div className="mt-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Search Result:</h3>
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Username
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Provider Name
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Location
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Mobile Number
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Email
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Experience
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            <tr className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                {foundProvider.username}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {foundProvider.providerName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {foundProvider.location}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {`${foundProvider.mobileNumber}`}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {foundProvider.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {foundProvider.experience}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => handleEditProvider(foundProvider)}
                                  className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                                  title="Edit Provider"
                                >
                                  <Edit className="h-4 w-4 mr-1" /> Edit
                                </button>
                                {/* DELETE BUTTON FOR PROVIDER (TRASH2 ICON) */}
                                <button
                                  onClick={() => handleDeleteClick(foundProvider.username, 'provider', foundProvider.providerName)}
                                  className="text-red-600 hover:text-red-900 inline-flex items-center"
                                  title="Delete Provider"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      !isProviderSearchActive && (
                        <div className="bg-white rounded-lg overflow-hidden">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2">All Providers:</h3>
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Username
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Provider Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Location
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Mobile Number
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Experience
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {providers.map((provider, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {provider.username}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {provider.providerName}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {provider.location}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {`${provider.mobileNumber}`}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {provider.email}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    {provider.experience}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex items-center justify-end space-x-2">
                                    <button
                                      onClick={() => handleEditProvider(provider)}
                                      className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                                      title="Edit Provider"
                                    >
                                      <Edit className="h-4 w-4 mr-1" /> Edit
                                    </button>
                                    {/* DELETE BUTTON FOR PROVIDER (TRASH2 ICON) */}
                                    <button
                                      onClick={() => handleDeleteClick(provider.username, 'provider', provider.providerName)}
                                      className="text-red-600 hover:text-red-900 inline-flex items-center"
                                      title="Delete Provider"
                                    >
                                      <Trash2 className="h-4 w-4 mr-1" /> Delete
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )
                    )}
                  </>
                )}
              </>
            )}

            {/* Create Customer Tab Content */}
            {activeTab === "create-customer" && (
              <CreateCustomer
                onCustomerCreated={handleNewCustomerCreated}
                onCancel={handleCreateCustomerCancel}
              />
            )}

            {/* Create Provider Tab Content */}
            {activeTab === "create-provider" && (
              <CreateProvider
                onProviderCreated={handleNewProviderCreated}
                onCancel={handleCreateProviderCancel}
              />
            )}

            {/* NEW: Create Service Tab Content */}
            {activeTab === "create-service" && (
              <CreateService
                onServiceCreated={handleNewServiceCreated}
                onCancel={handleCreateServiceCancel}
              />
            )}
          </div>
        </div>

        {/* Delete Confirmation Modal (This is rendered conditionally based on `showDeleteConfirmation` state) */}
        {itemToDelete && ( // Only render the modal if there's an item selected for deletion
          <DeleteConfirmationModal
            isOpen={showDeleteConfirmation}
            message={`Are you sure you want to delete ${itemToDelete.name} (${itemToDelete.username})? This action cannot be undone.`}
            onConfirm={handleConfirmDelete} // This links to the actual deletion logic in AdminDashboard
            onCancel={handleCancelDelete} // This handles closing the modal if user cancels
            loading={isDeleting} // Passes the loading state to show spinner in the modal
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
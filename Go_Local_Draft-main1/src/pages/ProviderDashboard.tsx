import React, { useState } from "react";
import {
  User,
  Star,
  Calendar,
  MessageCircle,
  Settings,
  Bell,
  TrendingUp,
  DollarSign,
  Clock,
  Users,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  Eye,
  Award,
  Target,
  BarChart3,
  Briefcase,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Provider } from "./AdminDashboard";
import axios from "axios";
import Services from "./Services";

const ProviderDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const[provider,setProvider] = useState<Provider | undefined>(undefined)
  const[username , setUsername] = useState<string | undefined>(undefined);

  // const stats = [
  //   {
  //     icon: DollarSign,
  //     label: "Total Earnings",
  //     value: "₹45,230",
  //     change: "+12%",
  //     color: "text-green-600",
  //     bg: "bg-green-100",
  //   },
  //   {
  //     icon: Users,
  //     label: "Total Customers",
  //     value: "127",
  //     change: "+8%",
  //     color: "text-blue-600",
  //     bg: "bg-blue-100",
  //   },
  //   {
  //     icon: CheckCircle,
  //     label: "Completed Jobs",
  //     value: "89",
  //     change: "+15%",
  //     color: "text-purple-600",
  //     bg: "bg-purple-100",
  //   },
  //   {
  //     icon: Star,
  //     label: "Average Rating",
  //     value: "4.8",
  //     change: "+0.2",
  //     color: "text-yellow-600",
  //     bg: "bg-yellow-100",
  //   },
  // ];

  // const recentJobs = [
  //   {
  //     id: 1,
  //     customer: "Sarah Johnson",
  //     service: "Interior Painting",
  //     date: "2024-01-15",
  //     status: "completed",
  //     amount: "₹2,500",
  //     rating: 5,
  //     image:
  //       "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400",
  //   },
  //   {
  //     id: 2,
  //     customer: "Michael Chen",
  //     service: "Exterior Painting",
  //     date: "2024-01-12",
  //     status: "in-progress",
  //     amount: "₹3,200",
  //     rating: null,
  //     image:
  //       "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400",
  //   },
  //   {
  //     id: 3,
  //     customer: "Emily Davis",
  //     service: "Wall Texturing",
  //     date: "2024-01-10",
  //     status: "pending",
  //     amount: "₹1,800",
  //     rating: null,
  //     image:
  //       "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=400",
  //   },
  // ];

  // const upcomingJobs = [
  //   {
  //     id: 1,
  //     customer: "John Doe",
  //     service: "Home Painting",
  //     date: "2024-01-22",
  //     time: "10:00 AM",
  //     amount: "₹2,800",
  //     address: "123 Main St, Chennai",
  //     phone: "+91 9876543210",
  //   },
  //   {
  //     id: 2,
  //     customer: "Jane Smith",
  //     service: "Office Painting",
  //     date: "2024-01-24",
  //     time: "2:00 PM",
  //     amount: "₹4,500",
  //     address: "456 Business Ave, Chennai",
  //     phone: "+91 9876543211",
  //   },
  // ];

  // const notifications = [
  //   {
  //     id: 1,
  //     type: "booking",
  //     message: "New booking request from John Doe",
  //     time: "2 hours ago",
  //     unread: true,
  //   },
  //   {
  //     id: 2,
  //     type: "review",
  //     message: "Sarah Johnson left a 5-star review",
  //     time: "1 day ago",
  //     unread: true,
  //   },
  //   {
  //     id: 3,
  //     type: "payment",
  //     message: "Payment of ₹2,500 received",
  //     time: "2 days ago",
  //     unread: false,
  //   },
  // ];

  // const services = [
  //   {
  //     id: 1,
  //     name: "Interior Painting",
  //     category: "Painting",
  //     price: "₹500/hour",
  //     status: "active",
  //     bookings: 45,
  //   },
  //   {
  //     id: 2,
  //     name: "Exterior Painting",
  //     category: "Painting",
  //     price: "₹600/hour",
  //     status: "active",
  //     bookings: 32,
  //   },
  //   {
  //     id: 3,
  //     name: "Wall Texturing",
  //     category: "Painting",
  //     price: "₹400/hour",
  //     status: "paused",
  //     bookings: 12,
  //   },
  // ];

  useEffect(() => {
    if(!username) return;
    // Define the async function INSIDE the effect
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
        setUsername(res.data.username);
      } catch (err) {
        // Handle error (show error message, etc.)
        console.error(err);
      }
    };

    fetchUsers(); // Call the async function
  },[]);


  useEffect(() => {
    // Define the async function INSIDE the effect
    const fetchProvider = async () => {
      try {
        const res = await axios.get<Provider>(
          `http://localhost:8080/api/provider/get-profile/${username}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log(res.data.username);
        setProvider(res.data);
      } catch (err) {
        // Handle error (show error message, etc.)
        console.error(err);
      }
    };

    fetchProvider(); // Call the async function
  },[]);


  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in-progress":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "active":
        return "bg-green-100 text-green-800";
      case "paused":
        return "bg-gray-100 text-gray-800";
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
                `${provider?.profilePicture}?byte64` ||
                "https://images.pexels.com/photos/5025639/pexels-photo-5025639.jpeg?auto=compress&cs=tinysrgb&w=150"
              }
              alt={provider?.providerName || ""}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.username}!
              </h1>
              <p className="text-gray-600">
                Manage your services and track your performance
              </p>
              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">
                    {provider?.rating} rating
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">
                    Verified Provider
                  </span>
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
                { id: "overview", label: "Overview", icon: TrendingUp },
                { id: "jobs", label: "Jobs", icon: Calendar },
                { id: "services", label: "My Services", icon: Briefcase },
                { id: "earnings", label: "Earnings", icon: DollarSign },
                { id: "profile", label: "Profile", icon: User },
                { id: "settings", label: "Settings", icon: Settings },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
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
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-xl p-6 hover-lift"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div
                          className={`w-12 h-12 rounded-lg ${stat.bg} flex items-center justify-center`}
                        >
                          <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <span className={`text-sm font-medium ${stat.color}`}>
                          {stat.change}
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900 mb-1">
                        {stat.value}
                      </div>
                      <div className="text-sm text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Upcoming Jobs */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Upcoming Jobs
                      </h3>
                      <button
                        onClick={() => setActiveTab("jobs")}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View All
                      </button>
                    </div>
                    <div className="space-y-4">
                      {upcomingJobs.map((job) => (
                        <div
                          key={job.id}
                          className="bg-white rounded-lg p-4 hover-lift"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">
                              {job.service}
                            </h4>
                            <span className="text-lg font-bold text-blue-600">
                              {job.amount}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            Customer: {job.customer}
                          </p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>
                              {job.date} at {job.time}
                            </span>
                            <button className="text-blue-600 hover:text-blue-700 font-medium">
                              View Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recent Reviews */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Recent Reviews
                      </h3>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View All
                      </button>
                    </div>
                    <div className="space-y-4">
                      {recentJobs
                        .filter((job) => job.rating)
                        .map((job) => (
                          <div key={job.id} className="bg-white rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-gray-900">
                                {job.customer}
                              </h4>
                              <div className="flex items-center space-x-1">
                                {[...Array(job.rating || 0)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="h-4 w-4 text-yellow-400 fill-current"
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">
                              {job.service}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {job.date}
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "jobs" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    All Jobs
                  </h3>
                  <div className="flex items-center space-x-4">
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option>All Status</option>
                      <option>Pending</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Service
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentJobs.map((job) => (
                        <tr key={job.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {job.service}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {job.customer}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {job.date}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}
                            >
                              {job.status.replace("-", " ")}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {job.amount}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button className="text-blue-600 hover:text-blue-900">
                                <Eye className="h-4 w-4" />
                              </button>
                              <button className="text-gray-600 hover:text-gray-900">
                                <MessageCircle className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "services" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    My Services
                  </h3>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                    <Plus className="h-4 w-4" />
                    <span>Add New Service</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <div
                      key={service.id}
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-semibold text-gray-900">
                          {service.name}
                        </h4>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(service.status)}`}
                        >
                          {service.status}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">
                        {service.category}
                      </p>
                      <p className="text-lg font-bold text-blue-600 mb-4">
                        {service.price}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-gray-500">
                          {service.bookings} bookings
                        </span>
                        <div className="flex space-x-2">
                          <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <button
                        className={`w-full py-2 rounded-lg transition-colors ${
                          service.status === "active"
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        }`}
                      >
                        {service.status === "active"
                          ? "Pause Service"
                          : "Activate Service"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "earnings" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Earnings Overview
                </h3>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <h4 className="font-medium text-gray-900 mb-4">
                        Monthly Earnings
                      </h4>
                      <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500">
                            Earnings chart would go here
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <h4 className="font-medium text-gray-900 mb-4">
                        This Month
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Gross Earnings</span>
                          <span className="font-medium">₹8,450</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Platform Fee</span>
                          <span className="font-medium text-red-600">
                            -₹845
                          </span>
                        </div>
                        <div className="flex justify-between border-t pt-3">
                          <span className="font-medium">Net Earnings</span>
                          <span className="font-bold text-green-600">
                            ₹7,605
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <h4 className="font-medium text-gray-900 mb-4">
                        Payment Info
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Next Payout</span>
                          <span className="font-medium">Jan 30, 2024</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Amount</span>
                          <span className="font-medium text-green-600">
                            ₹7,605
                          </span>
                        </div>
                      </div>
                      <button className="w-full mt-4 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Update Bank Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Provider Profile
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue={provider?.name}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue={provider?.email}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        defaultValue={user?.phone}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.location}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Service Category
                      </label>
                      <select
                        defaultValue={user?.serviceCategory}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option>Home Cleaning</option>
                        <option>Painting Services</option>
                        <option>Electrical Work</option>
                        <option>Plumbing</option>
                        <option>Gardening</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Hourly Rate
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.hourlyRate}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                      </label>
                      <textarea
                        rows={4}
                        defaultValue={user?.description}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    </div>
                    <button className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      Update Profile
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Provider Settings
                </h3>
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-medium text-gray-900 mb-4">
                      Availability Settings
                    </h4>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">
                          Available for new bookings
                        </span>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">
                          Instant booking (auto-accept)
                        </span>
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">
                          Weekend availability
                        </span>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-medium text-gray-900 mb-4">
                      Notification Preferences
                    </h4>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">
                          Email notifications for new bookings
                        </span>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">
                          SMS notifications for urgent messages
                        </span>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">
                          Marketing emails
                        </span>
                        <input
                          type="checkbox"
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </label>
                    </div>
                  </div>

                  <div className="bg-red-50 rounded-xl p-6">
                    <h4 className="font-medium text-red-900 mb-4">
                      Danger Zone
                    </h4>
                    <p className="text-sm text-red-700 mb-4">
                      Once you delete your account, there is no going back.
                      Please be certain.
                    </p>
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDashboard;
function useEffect(arg0: () => void, arg1: never[]) {
  throw new Error("Function not implemented.");
}


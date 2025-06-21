import React, { useState } from "react";
import {
  User,
  Calendar,
  Heart,
  Clock,
  Star,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Settings,
  Search,
  Filter,
  Eye,
  Trash2,
  MessageCircle,
  Shield,
  Award,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");

  const bookings = [
    {
      id: "1",
      service: "Home Cleaning",
      provider: "Sarah Johnson",
      date: "2024-01-20",
      time: "2:00 PM",
      status: "confirmed",
      amount: "₹800",
      rating: null,
      image:
        "https://images.pexels.com/photos/5025639/pexels-photo-5025639.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "2",
      service: "Electrical Work",
      provider: "Michael Chen",
      date: "2024-01-18",
      time: "10:00 AM",
      status: "completed",
      amount: "₹1200",
      rating: 5,
      image:
        "https://images.pexels.com/photos/5691656/pexels-photo-5691656.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "3",
      service: "Plumbing",
      provider: "David Wilson",
      date: "2024-01-15",
      time: "11:30 AM",
      status: "completed",
      amount: "₹950",
      rating: 4,
      image:
        "https://images.pexels.com/photos/8386440/pexels-photo-8386440.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
  ];

  const favorites = [
    {
      id: "1",
      name: "Sarah Johnson",
      service: "Home Cleaning",
      rating: 4.9,
      reviews: 127,
      price: "₹500/hour",
      image:
        "https://images.pexels.com/photos/5025639/pexels-photo-5025639.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
    {
      id: "2",
      name: "Michael Chen",
      service: "Electrical Work",
      rating: 4.8,
      reviews: 89,
      price: "₹800/hour",
      image:
        "https://images.pexels.com/photos/5691656/pexels-photo-5691656.jpeg?auto=compress&cs=tinysrgb&w=400",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const stats = [
    {
      icon: Calendar,
      label: "Total Bookings",
      value: "12",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      icon: Heart,
      label: "Favorite Providers",
      value: "8",
      color: "text-red-600",
      bg: "bg-red-100",
    },
    {
      icon: CreditCard,
      label: "Total Spent",
      value: "₹8,450",
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      icon: Star,
      label: "Average Rating Given",
      value: "4.7",
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <img
              src={
                user?.avatar ||
                "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=150"
              }
              alt={user?.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user?.name}!
              </h1>
              <p className="text-gray-600">
                Manage your bookings and discover new services
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {[
                { id: "overview", label: "Overview", icon: TrendingUp },
                { id: "bookings", label: "My Bookings", icon: Calendar },
                { id: "favorites", label: "Favorites", icon: Heart },
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
                  {/* Recent Bookings */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Recent Bookings
                      </h3>
                      <button
                        onClick={() => setActiveTab("bookings")}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View All
                      </button>
                    </div>
                    <div className="space-y-4">
                      {bookings.slice(0, 3).map((booking) => (
                        <div
                          key={booking.id}
                          className="bg-white rounded-lg p-4 hover-lift"
                        >
                          <div className="flex items-center space-x-4">
                            <img
                              src={booking.image}
                              alt={booking.service}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">
                                {booking.service}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {booking.provider}
                              </p>
                              <p className="text-xs text-gray-500">
                                {booking.date} at {booking.time}
                              </p>
                            </div>
                            <div className="text-right">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}
                              >
                                {booking.status}
                              </span>
                              <p className="text-sm font-medium text-gray-900 mt-1">
                                {booking.amount}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Favorite Providers */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Favorite Providers
                      </h3>
                      <button
                        onClick={() => setActiveTab("favorites")}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View All
                      </button>
                    </div>
                    <div className="space-y-4">
                      {favorites.map((provider) => (
                        <div
                          key={provider.id}
                          className="bg-white rounded-lg p-4 hover-lift"
                        >
                          <div className="flex items-center space-x-4">
                            <img
                              src={provider.image}
                              alt={provider.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">
                                {provider.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {provider.service}
                              </p>
                              <div className="flex items-center space-x-2">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-sm text-gray-600">
                                  {provider.rating} ({provider.reviews} reviews)
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium text-gray-900">
                                {provider.price}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "bookings" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    All Bookings
                  </h3>
                  <div className="flex items-center space-x-4">
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                      <option>All Status</option>
                      <option>Confirmed</option>
                      <option>Completed</option>
                      <option>Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="bg-white rounded-lg overflow-hidden">
                  <div className="grid gap-4">
                    {bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <img
                              src={booking.image}
                              alt={booking.service}
                              className="w-16 h-16 rounded-lg object-cover"
                            />
                            <div>
                              <h4 className="font-semibold text-gray-900 text-lg">
                                {booking.service}
                              </h4>
                              <p className="text-gray-600">
                                Provider: {booking.provider}
                              </p>
                              <div className="flex items-center space-x-4 mt-2">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-600">
                                    {booking.date}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Clock className="h-4 w-4 text-gray-400" />
                                  <span className="text-sm text-gray-600">
                                    {booking.time}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)} mb-2 inline-block`}
                            >
                              {booking.status}
                            </span>
                            <p className="text-xl font-bold text-gray-900">
                              {booking.amount}
                            </p>

                            <div className="flex items-center space-x-2 mt-4">
                              {booking.status === "completed" &&
                                !booking.rating && (
                                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                                    Rate Service
                                  </button>
                                )}
                              {booking.status === "completed" &&
                                booking.rating && (
                                  <div className="flex items-center space-x-1">
                                    {[...Array(booking.rating)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className="h-4 w-4 text-yellow-400 fill-current"
                                      />
                                    ))}
                                  </div>
                                )}
                              <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
                                <MessageCircle className="h-4 w-4" />
                              </button>
                              <button className="p-2 text-gray-600 hover:text-gray-800 transition-colors">
                                <Eye className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "favorites" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Favorite Service Providers
                  </h3>
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search favorites..."
                        className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((provider) => (
                    <div
                      key={provider.id}
                      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
                    >
                      <div className="relative mb-4">
                        <img
                          src={provider.image}
                          alt={provider.name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-50">
                          <Heart className="h-4 w-4 text-red-500 fill-current" />
                        </button>
                      </div>

                      <h4 className="font-semibold text-gray-900 mb-1">
                        {provider.name}
                      </h4>
                      <p className="text-gray-600 mb-2">{provider.service}</p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">
                            {provider.rating}
                          </span>
                          <span className="text-sm text-gray-500">
                            ({provider.reviews})
                          </span>
                        </div>
                        <span className="font-semibold text-blue-600">
                          {provider.price}
                        </span>
                      </div>

                      <div className="flex space-x-2">
                        <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                          Book Now
                        </button>
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          <MessageCircle className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "profile" && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Profile Information
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        defaultValue={user?.name}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        defaultValue={user?.email}
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
                        Profile Picture
                      </label>
                      <div className="flex items-center space-x-4">
                        <img
                          src={
                            user?.avatar ||
                            "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=150"
                          }
                          alt="Profile"
                          className="w-20 h-20 rounded-full object-cover"
                        />
                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                          Change Picture
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Preferences
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">
                            Email notifications for bookings
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">
                            SMS notifications
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-3 text-sm text-gray-700">
                            Marketing emails
                          </span>
                        </label>
                      </div>
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
                  Account Settings
                </h3>
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h4 className="font-medium text-gray-900 mb-4">
                      Privacy & Security
                    </h4>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">
                          Show my profile in search results
                        </span>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">
                          Allow providers to contact me directly
                        </span>
                        <input
                          type="checkbox"
                          defaultChecked
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-gray-700">
                          Enable two-factor authentication
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

export default CustomerDashboard;

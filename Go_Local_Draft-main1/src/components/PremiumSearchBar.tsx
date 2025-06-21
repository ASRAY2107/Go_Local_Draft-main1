import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFilters } from "../contexts/FilterContext";

const PremiumSearchBar: React.FC = () => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const { filters, updateFilter } = useFilters();

  const trendingServices = [
    { name: "Home Cleaning", icon: "🏠", trend: "+25%" },
    { name: "Plumbing", icon: "🔧", trend: "+18%" },
    { name: "Electrical Work", icon: "⚡", trend: "+22%" },
    { name: "Painting", icon: "🎨", trend: "+15%" },
    { name: "Gardening", icon: "🌱", trend: "+30%" },
    { name: "Tutoring", icon: "📚", trend: "+40%" },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (filters.search.trim() || filters.location.trim()) {
      const params = new URLSearchParams();
      if (filters.search) params.append("q", filters.search);
      if (filters.location) params.append("location", filters.location);
      if (filters.category) params.append("category", filters.category);
      if (filters.priceRange) params.append("priceRange", filters.priceRange);
      if (filters.rating) params.append("rating", filters.rating);
      if (filters.availability)
        params.append("availability", filters.availability);

      navigate(`/search?${params.toString()}`);
    }
  };

  useEffect(() => {
    const handleClickOutside = () => {
      setShowSuggestions(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto relative dropdown-container">
      {/* Main Search Container */}
      <div className="search-premium rounded-3xl p-2 shadow-premium">
        <form onSubmit={handleSearch} className="flex items-center">
          {/* Service Search */}
          <div className="flex-1 flex items-center px-4">
            <Search className="h-6 w-6 text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="What service do you need?"
              value={filters.search}
              onChange={(e) => {
                updateFilter("search", e.target.value);
                setShowSuggestions(true);
              }}
              onClick={(e) => {
                e.stopPropagation();
                setShowSuggestions(true);
              }}
              className="flex-1 bg-transparent border-none outline-none text-lg text-gray-700 placeholder-gray-500 font-medium"
            />
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-gray-300 mx-2"></div>

          {/* Location Search */}
          <div className="flex-1 flex items-center px-4">
            <MapPin className="h-6 w-6 text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="Enter your location"
              value={filters.location}
              onChange={(e) => updateFilter("location", e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-lg text-gray-700 placeholder-gray-500 font-medium"
            />
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="btn-premium text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-glow hover-lift"
          >
            Search
          </button>
        </form>
      </div>

      {/* Trending Services */}
      {showSuggestions && (
        <div className="dropdown-content mt-4 p-6 animate-slide-down">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-5 w-5 text-orange-500 mr-2" />
            <h3 className="font-semibold text-gray-900">Trending Services</h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {trendingServices.map((service, index) => (
              <button
                key={index}
                onClick={() => {
                  updateFilter("search", service.name);
                  setShowSuggestions(false);
                  navigate(
                    `/search?q=${encodeURIComponent(service.name)}&location=${encodeURIComponent(filters.location)}`,
                  );
                }}
                className="flex items-center p-3 rounded-xl hover:bg-gray-50 transition-all duration-300 group hover-lift"
              >
                <span className="text-2xl mr-3">{service.icon}</span>
                <div className="text-left">
                  <div className="font-medium text-gray-900 group-hover:text-blue-600">
                    {service.name}
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    {service.trend}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumSearchBar;
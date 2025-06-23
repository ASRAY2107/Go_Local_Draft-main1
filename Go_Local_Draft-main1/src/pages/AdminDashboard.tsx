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
  Plus,
  Search,
  Settings,
  Shield,
  Star,
  Trash2,
  TrendingUp,
  Users
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export type Users = {
  username: string;
  password: string;
  role: string;
  isDeleted: boolean;
};






const AdminDashboard: React.FC = () => {
   const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [userss, setUserss] = useState<Users[]>([]);

  const stats = [
    {
      icon: Users,
      label: "Total Users",
      value: "2,847",
      change: "+12%",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      icon: Activity,
      label: "Active Bookings",
      value: "156",
      change: "+8%",
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      icon: DollarSign,
      label: "Total Revenue",
      value: "₹2,45,670",
      change: "+15%",
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      icon: Star,
      label: "Avg Rating",
      value: "4.8",
      change: "+0.2",
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
  ];



 


  // const CustomersUsers = async () => {
  //   const Cusres = await axios.get("http://localhost:8080/api/admin/get-customers", {
  //     headers: {
  //       Authorization: `Bearer ${localStorage.getItem("token")}`,
  //       'Content-Type': 'application/json'
  //     }
  //   })

  //   return Cusres.data;
  // }


  // const customers = async() =>{
  //   const customer_list = await axios("http://localhost:8080/api/admin/get-customers") ,{
  //     headers:{
  //       Authorization :`Bearer ${loacalStorage.getItem("token")}`,
  //       'Content-Type' : 'application/json'
  //     }
  //   }
  //   return;
  // })

  useEffect(() => {
    // Define the async function INSIDE the effect
    const fetchUsers = async () => {
      try {
        const res = await axios.get<Users[]>(
          'http://localhost:8080/api/admin/get-users',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              'Content-Type': 'application/json'
            }
          }
        );

        console.log(res);
        setUserss(res.data);
      } catch (err) {
        // Handle error (show error message, etc.)
        console.error(err);
      }
    };

    fetchUsers(); // Call the async function
  },[]); // Empty deps = run on initiual mount

  // console.log(users);

  type Customer = {
    username:String,
    customerName :String,
    location :String,
    mobileNumber : BigInt,
    email:String,
    rating:String,
    profilePicture: Uint8Array ,
    noOfBookings:number
  }

  const[customers , setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    // Define the async function INSIDE the effect
    const CustomersUsers = async () => {
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
        // Handle error (show error message, etc.)
        console.error(err);
      }
    };

    CustomersUsers(); // Call the async function
  }, []); // Empty deps = run on mount

  console.log(customers);

  type Services = {
    serviceId :string,
    serviceName :string,
    noOfUser :number

  }


type Provider = {
    username:String,
    providerName :String,
    location :String,
    mobileNumber : BigInt,
    email:String,
    rating:String,
    profilePicture: Uint8Array ,
    noOfBookings:number,
    service: Services,
    experience: number
    description: Uint8Array,
    noOfTimesBooked: number
}
const[providers , setProvider] = useState<Provider[]>([]);

useEffect(() => {
  // Define the async function INSIDE the effect
  const ProvidersUsers = async () => {
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
      setProvider(prores.data);
    } catch (err) {
      // Handle error (show error message, etc.)
      console.error(err);
    }
  };

  ProvidersUsers(); // Call the async function
}, []); // Empty deps = run on mount

console.log(providers);


  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState("All Roles");

  // useEffect(() => {
  //   const fetchUsersRole = async () => {
  //     setLoading(true);
  //     try {
  //       let url = "http://localhost:8080/api/admin/get-user";
  //       if (selectedRole !== "All Roles") {
  //         // If your API expects role as a query parameter, adjust as needed
  //         url += `?role=${selectedRole.toLowerCase()}`;
  //       }
  //       const res = await axios.get(url, {
  //         headers: {
  //           Authorization: `Bearer ${localStorage.getItem("token")}`,
  //           "Content-Type": "application/json",
  //         },
  //       });
  //       setUsers(res.data);
  //     } catch (err) {
  //       setUsers([]);
  //       console.error(err);
  //     }
  //     setLoading(false);
  //   };

  //   fetchUsersRole();
  // }, [selectedRole]);




  // const users = [
  //   {
  //     id: "1",
  //     name: "John Customer",
  //     email: "john@example.com",
  //     role: "customer",
  //     status: "active",
  //     joinDate: "2024-01-15",
  //     totalBookings: 12,
  //     avatar:
  //       "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=150",
  //   },
  //   {
  //     id: "2",
  //     name: "Sarah Provider",
  //     email: "sarah@example.com",
  //     role: "provider",
  //     status: "active",
  //     joinDate: "2024-01-10",
  //     totalBookings: 89,
  //     rating: 4.8,
  //     avatar:
  //       "https://images.pexels.com/photos/5025639/pexels-photo-5025639.jpeg?auto=compress&cs=tinysrgb&w=150",
  //   },
  //   {
  //     id: "3",
  //     name: "Mike Wilson",
  //     email: "mike@example.com",
  //     role: "provider",
  //     status: "pending",
  //     joinDate: "2024-01-20",
  //     totalBookings: 0,
  //     avatar:
  //       "https://images.pexels.com/photos/3184454/pexels-photo-3184454.jpeg?auto=compress&cs=tinysrgb&w=150",
  //   },
  // ];

  // const users = await axios.get("http://localhost:8080/api/admin/get-users");

  const services = [
    {
      id: "1",
      name: "Home Cleaning",
      category: "Household",
      providers: 45,
      bookings: 234,
      avgRating: 4.7,
      status: "active",
    },
    {
      id: "2",
      name: "Electrical Work",
      category: "Maintenance",
      providers: 32,
      bookings: 189,
      avgRating: 4.8,
      status: "active",
    },
    {
      id: "3",
      name: "Plumbing",
      category: "Maintenance",
      providers: 28,
      bookings: 156,
      avgRating: 4.6,
      status: "active",
    },
  ];

  const recentActivity = [
    {
      id: "1",
      type: "user_registered",
      message: "New user John Doe registered as customer",
      time: "2 hours ago",
      status: "info",
    },
    {
      id: "2",
      type: "booking_completed",
      message: "Booking #1234 completed successfully",
      time: "4 hours ago",
      status: "success",
    },
    {
      id: "3",
      type: "report_submitted",
      message: "User reported issue with provider",
      time: "6 hours ago",
      status: "warning",
    },
    {
      id: "4",
      type: "payment_processed",
      message: "Payment of ₹2,500 processed",
      time: "8 hours ago",
      status: "success",
    },
  ];







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

                Welcome back, {user?.username} Manage your platform efficiently
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
                { id: "overview", label: "Overview", icon: TrendingUp },
                { id: "users", label: "Users", icon: Users },
                { id: "customer", label: "Customer", icon: Activity }, //cuustomer
                { id: "provider", label: "Provider", icon: BarChart3 } //provider
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

                {/* Charts and Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Platform Growth
                    </h3>
                    <div className="h-64 bg-white rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">
                          Growth chart would go here
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Recent Activity
                      </h3>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View All
                      </button>
                    </div>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className="bg-white rounded-lg p-4"
                        >
                          <div className="flex items-start space-x-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center ${activity.status === "info"
                                  ? "bg-blue-100"
                                  : activity.status === "success"
                                    ? "bg-green-100"
                                    : activity.status === "warning"
                                      ? "bg-yellow-100"
                                      : "bg-red-100"
                                }`}
                            >
                              {activity.status === "info" && (
                                <Activity className="h-4 w-4 text-blue-600" />
                              )}
                              {activity.status === "success" && (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              )}
                              {activity.status === "warning" && (
                                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-900">
                                {activity.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {activity.time}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button
                      onClick={() => setActiveTab("users")}
                      className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow text-center"
                    >
                      <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="font-medium text-gray-900">Manage Users</p>
                    </button>
                    <button
                      onClick={() => setActiveTab("customer")}
                      className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow text-center"
                    >
                      <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="font-medium text-gray-900">
                        All Customers
                      </p>
                    </button>
                    {/* <button
                      onClick={() => setActiveTab("reports")}
                      className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow text-center"
                    >
                      <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                      <p className="font-medium text-gray-900">View Reports</p>
                    </button>
                    <button
                      onClick={() => setActiveTab("analytics")}
                      className="bg-white p-4 rounded-lg hover:shadow-md transition-shadow text-center"
                    >
                      <BarChart3 className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <p className="font-medium text-gray-900">Analytics</p>
                    </button> */}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "users" && (
              <>

              <div className="bg-white rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    
                      {userss.map((userr) => (
                        <tr key={userr.username} className="hover:bg-gray-50">
                          
                          <td className="px-6 py-4 whitespace-nowrap">
                            {userr.username}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(userr.role)}`}
                            >
                              {userr.role}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div></>
            
              
            )}

            

          {activeTab === "customer" && (
            <>

            <div className="bg-white rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customers
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Name

                      </th>


                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Location

                      </th>
                    </tr>

                  </thead>
                  
                  <tbody className="bg-white divide-y divide-gray-200">
                    {customers.map((customer) => (
                      <tr  className="hover:bg-gray-50">
    
                        <td className="px-6 py-4 whitespace-nowrap">
          
                          {customer.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          
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

                        <td className="px-6 py-4 whitespace-nowrap">
                          {customer.rating}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {customer.profilePicture}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {customer.noOfBookings}
                        </td>

                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div></>
          
          )}



          {activeTab === "provider" && (
            <>

            <div className="bg-white rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Providers
                      </th>
                      {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th> */}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {providers.map((provider) => (
                      <tr  className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {provider.username}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          
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
                          {provider.rating}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {provider.profilePicture}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {provider.noOfBookings}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {provider.service.serviceId}
                          {provider.service.serviceName}
                          {provider.service.noOfUser}
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          {provider.experience}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {provider.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {provider.noOfTimesBooked}
                        </td>

                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div></>
          )}



          {/* {activeTab === "reports" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Reports & Issues
              </h3>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3" />
                  <div>
                    <h4 className="font-medium text-yellow-800">
                      3 pending reports require attention
                    </h4>
                    <p className="text-sm text-yellow-700">
                      Review and resolve user-reported issues
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                  <AlertTriangle className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">3</div>
                  <div className="text-sm text-gray-600">Pending Reports</div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                  <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">24</div>
                  <div className="text-sm text-gray-600">
                    Resolved This Week
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                  <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">2.4h</div>
                  <div className="text-sm text-gray-600">
                    Avg Resolution Time
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h4 className="font-medium text-gray-900">
                    Recent Reports
                  </h4>
                </div>
                <div className="divide-y divide-gray-200">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="px-6 py-4 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-gray-900">
                            Report #{1000 + i}
                          </h5>
                          <p className="text-sm text-gray-600">
                            Provider misconduct reported
                          </p>
                          <p className="text-xs text-gray-500">
                            Submitted 2 hours ago
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            Pending
                          </span>
                          <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Review
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )} */}

          {/* {activeTab === "settings" && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                System Settings
              </h3>
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h4 className="font-medium text-gray-900 mb-4">
                    Platform Settings
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          User Registration
                        </label>
                        <p className="text-xs text-gray-500">
                          Allow new users to register
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Auto-approve Providers
                        </label>
                        <p className="text-xs text-gray-500">
                          Automatically approve new service providers
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Maintenance Mode
                        </label>
                        <p className="text-xs text-gray-500">
                          Put the platform in maintenance mode
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h4 className="font-medium text-gray-900 mb-4">
                    Commission Settings
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Platform Fee (%)
                      </label>
                      <input
                        type="number"
                        defaultValue="10"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Processing Fee (%)
                      </label>
                      <input
                        type="number"
                        defaultValue="2.9"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-red-50 rounded-xl p-6">
                  <h4 className="font-medium text-red-900 mb-4">
                    Danger Zone
                  </h4>
                  <div className="space-y-3">
                    <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
                      Reset All Data
                    </button>
                    <p className="text-sm text-red-700">
                      This action cannot be undone. This will permanently
                      delete all platform data.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
    </div >
  );
};

export default AdminDashboard;
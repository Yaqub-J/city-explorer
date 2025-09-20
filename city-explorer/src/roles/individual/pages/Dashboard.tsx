import { useState } from "react";
import { Search, MapPin, Pizza, Store } from "lucide-react";
import { useNavigate } from "react-router";

// Mock data
const mockBusinesses = [
  {
    id: 1,
    businessName: "Burger Palace",
    category: "Dining",
    description: "Best burgers in town with 50% off your first order",
    location: "Downtown",
    color: "bg-bg-primary-dark2",
  },
  {
    id: 2,
    businessName: "Tech Solutions",
    category: "Services",
    description: "Professional IT support and computer repairs available",
    location: "City Center",
    color: "bg-bg-primary-dark2",
  },
  {
    id: 3,
    businessName: "Fresh Smoothies",
    category: "Dining",
    description: "Healthy smoothies made with fresh organic fruits",
    location: "Mall Plaza",
    color: "bg-bg-primary-dark2",
  },
  {
    id: 4,
    businessName: "Style Studio",
    category: "Services",
    description: "Premium hair styling and beauty treatments",
    location: "Fashion District",
    color: "bg-bg-primary-dark2",
  },
];

const categories = [
  {
    id: 1,
    name: "All",
    active: true,
    color: "bg-bg-primary-dark2",
  },
  { id: 2, name: "Dining", active: false, color: "bg-bg-primary-dark2" },
  { id: 3, name: "Services", active: false, color: "bg-bg-primary-dark2" },
  { id: 4, name: "Events", active: false, color: "bg-bg-primary-dark2" },
  { id: 5, name: "Shopping", active: false, color: "bg-bg-primary-dark2" },
  { id: 6, name: "Auto", active: false, color: "bg-bg-primary-dark2" },
];

// const bottomCategories = [
//   {
//     id: 1,
//     icon: <Wrench className="w-6 h-6" />,
//     name: "Auto repairs",
//     color: "bg-purple-500",
//   },
//   {
//     id: 2,
//     icon: <Pizza className="w-6 h-6" />,
//     name: "Takeout",
//     color: "bg-orange-500",
//   },
//   {
//     id: 3,
//     icon: <Coffee className="w-6 h-6" />,
//     name: "Smoothies",
//     color: "bg-teal-400",
//   },
//   {
//     id: 4,
//     icon: <ShoppingCart className="w-6 h-6" />,
//     name: "Shopping",
//     color: "bg-purple-400",
//   },
// ];

const Dashboard = () => {
  const [activeCategory, setActiveCategory] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between">
        <h3 className="font-bold">Good morning, Mubarak</h3>
      </div>

      {/* Hero Section */}
      <div className="mx-6 my-6">
        <div className="bg-gradient-to-r from-bg-primary-dark2 to-bg-primary-dark rounded-2xl p-6 md:p-8 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-md">
              <h2 className="text-white text-2xl md:text-3xl font-bold mb-4 leading-tight">
                Plan your next outing or find local services around the city
              </h2>

              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for restaurants, hotels..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white text-text-primary placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                />
              </div>
            </div>

            <div className="hidden md:block ml-8">
              <div className="w-48 h-48 relative">
                <div className="w-full h-full bg-gradient-to-br from-bg-primary-dark2 to-bg-primary-dark rounded-full flex items-center justify-center shadow-2xl">
                  <Pizza className="w-24 h-24 text-white" />
                </div>
                <div className="absolute -top-2 -left-2 w-16 h-16 bg-green-400 rounded-full opacity-80"></div>
                <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-red-400 rounded-full opacity-80"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Explore Categories */}
      <div className="mx-6 mb-6">
        <h3 className="font-bold mb-4">Explore</h3>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${
                activeCategory === category.id
                  ? `${category.color} text-white`
                  : "bg-white text-text-primary hover:bg-gray-100"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Deals */}
      <div className="mx-6 mb-8">
        <h3 className="font-bold mb-6">Featured Businesses</h3>
        <div className="grid md:grid-cols-2 gap-6">
          {mockBusinesses.map((business) => (
            <div
              key={business.id}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/business/${business.id}`)}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-16 h-16 ${business.color} rounded-xl flex items-center justify-center flex-shrink-0`}
                >
                  <Store className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="text-lg font-semibold text-blue-600 mb-1">
                    {business.businessName}
                  </h4>
                  <span className="inline-block bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium mb-2">
                    {business.category}
                  </span>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {business.description}
                  </p>
                  <div className="flex items-center mt-2 text-gray-500 text-sm">
                    <MapPin className="w-4 h-4 mr-1" />
                    {business.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Category Icons */}
      {/* <div className="mx-6 mb-8">
        <div className="flex justify-center gap-8 md:gap-12">
          {bottomCategories.map((category) => (
            <div key={category.id} className="text-center cursor-pointer group">
              <div
                className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shadow-lg`}
              >
                <div className="text-white">{category.icon}</div>
              </div>
              <p className="text-sm font-medium text-gray-700">
                {category.name}
              </p>
            </div>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default Dashboard;

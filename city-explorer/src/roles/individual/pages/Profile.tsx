import React, { useState } from "react";
import {
  User,
  Star,
  Camera,
  CreditCard,
  Settings,
  Bell,
  Mail,
  MessageCircle,
  Palette,
  Shield,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  count?: number;
}

const Profile: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>("favorites");
  const navigate = useNavigate();

  const profileData = {
    name: "Aisha Eeshat",
    bio: "A fun and outdoor lover. Techie",
    points: 97,
    reviews: 797,
    photos: 16,
    profileCompletion: 70,
  };

  const favoriteMenuItems: MenuItem[] = [
    { id: "favorites", label: "Favorites", icon: <Star className="w-5 h-5" /> },
    { id: "points", label: "My Points", icon: <Star className="w-5 h-5" /> },
    {
      id: "reviews",
      label: "Reviews",
      icon: <MessageCircle className="w-5 h-5" />,
    },
    { id: "photos", label: "Photos", icon: <Camera className="w-5 h-5" /> },
    {
      id: "payments",
      label: "Payments",
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  const settingsMenuItems: MenuItem[] = [
    {
      id: "push",
      label: "Push Notifications",
      icon: <Bell className="w-5 h-5" />,
    },
    {
      id: "email",
      label: "Email Notifications",
      icon: <Mail className="w-5 h-5" />,
    },
    {
      id: "messaging",
      label: "Direct Messaging",
      icon: <MessageCircle className="w-5 h-5" />,
    },
    {
      id: "preferences",
      label: "Preferences",
      icon: <Settings className="w-5 h-5" />,
    },
    { id: "theme", label: "Theme", icon: <Palette className="w-5 h-5" /> },
    {
      id: "security",
      label: "Security & Login",
      icon: <Shield className="w-5 h-5" />,
    },
    { id: "logout", label: "Logout", icon: <LogOut className="w-5 h-5" /> },
  ];

  const handleSectionClick = (sectionId: string): void => {
    setActiveSection(sectionId);
  };

  const handleMyBusinessPage = (): void => {
    console.log("Opening My Business Page...");
  };

  const handlePlanMyDay = (): void => {
    console.log("Opening Plan My Day...");
  };

  const handleEditProfile = (): void => {
    if (activeSection === "settings") {
      navigate("/edit-profile");
    } else {
      setActiveSection("settings");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="p-6 ">
        <div className="flex items-start space-x-4 bg-bg-primary border border-border-primary p-6 rounded-lg">
          {/* Profile Avatar */}
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            <User className="w-8 h-8 text-gray-400" />
          </div>

          {/* Profile Info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">
              {profileData.name}
            </h1>
            <p className="text-gray-600 mb-3">{profileData.bio}</p>

            {/* Stats */}
            <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
              <span>
                <strong className="text-gray-900">{profileData.points}</strong>{" "}
                Points
              </span>
              <span>
                <strong className="text-gray-900">{profileData.reviews}</strong>{" "}
                Reviews
              </span>
              <span>
                <strong className="text-gray-900">{profileData.photos}</strong>{" "}
                Photos
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 mb-4">
              <Button onClick={handleMyBusinessPage}>My Business Page</Button>
              <Button onClick={handlePlanMyDay} variant="outline">
                Plan My Day
              </Button>
            </div>

            {/* Profile Completion */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">
                  Profile Completion: {profileData.profileCompletion}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`bg-bg-primary-dark2 h-2 w-${profileData.profileCompletion}% rounded-full transition-all duration-300`}
                  style={{ width: `${profileData.profileCompletion}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Favorites Section */}
      <div className="p-6 ">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Favorites</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {favoriteMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSectionClick(item.id)}
              className={`p-4 rounded-lg border border-border-primary bg-white hover:bg-gray-50 transition-colors duration-200 text-center ${
                activeSection === item.id
                  ? "ring-2 ring-blue-500 border-blue-500"
                  : ""
              }`}
            >
              <div className="flex flex-col items-center space-y-2">
                <div className="text-gray-600">{item.icon}</div>
                <span className="text-sm font-medium text-gray-900">
                  {item.label}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Settings Section */}
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Settings</h2>
        <div className="space-y-2">
          {settingsMenuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === "settings") {
                  handleEditProfile();
                } else {
                  handleSectionClick(item.id);
                }
              }}
              className={`w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 bg-bg-primary border border-border-primary transition-colors duration-200 text-left ${
                item.id === "logout" ? "hover:bg-red-50 hover:text-red-600" : ""
              }`}
            >
              <div
                className={`${
                  item.id === "logout" ? "text-red-500" : "text-gray-600"
                }`}
              >
                {item.icon}
              </div>
              <span
                className={`font-medium ${
                  item.id === "logout" ? "text-red-600" : "text-gray-900"
                }`}
              >
                {item.label}
              </span>
              {item.count && (
                <span className="ml-auto bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                  {item.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;

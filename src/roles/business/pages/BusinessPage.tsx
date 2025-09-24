import React, { useState } from "react";
import { Phone, Mail, Globe, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TabType {
  id: string;
  label: string;
  active: boolean;
}

const BusinessPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("overview");

  const tabs: TabType[] = [
    { id: "overview", label: "Overview", active: true },
    { id: "deals", label: "Deals", active: false },
    { id: "events", label: "Events", active: false },
    { id: "reviews", label: "Reviews", active: false },
    { id: "gallery", label: "Gallery", active: false },
  ];

  const handleTabClick = (tabId: string): void => {
    setActiveTab(tabId);
  };

  const handleCallClick = (): void => {
    window.open("tel:+11234567390", "_self");
  };

  const handleDirectionsClick = (): void => {
    // This would typically open maps with the business location
    console.log("Opening directions...");
  };

  return (
    <div className="border border-border-primary rounded-lg shadow-sm bg-bg-primary p-6">
      {/* Header Image */}
      <div className="relative h-48 bg-gradient-to-r from-amber-100 to-orange-100">
        <img
          src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 300'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23f3e8d8'/%3E%3Cstop offset='100%25' style='stop-color:%23e8d5b7'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='800' height='300' fill='url(%23bg)'/%3E%3Cg transform='translate(50,50)'%3E%3Crect x='0' y='0' width='120' height='80' rx='8' fill='%23d4a574' opacity='0.7'/%3E%3Crect x='10' y='10' width='100' height='60' rx='4' fill='%23f4f4f4'/%3E%3Ccircle cx='60' cy='40' r='15' fill='%23d4a574'/%3E%3C/g%3E%3Cg transform='translate(200,80)'%3E%3Crect x='0' y='0' width='120' height='80' rx='8' fill='%23d4a574' opacity='0.6'/%3E%3Crect x='10' y='10' width='100' height='60' rx='4' fill='%23f4f4f4'/%3E%3Ccircle cx='60' cy='40' r='15' fill='%23d4a574'/%3E%3C/g%3E%3Cg transform='translate(350,60)'%3E%3Crect x='0' y='0' width='120' height='80' rx='8' fill='%23d4a574' opacity='0.8'/%3E%3Crect x='10' y='10' width='100' height='60' rx='4' fill='%23f4f4f4'/%3E%3Ccircle cx='60' cy='40' r='15' fill='%23d4a574'/%3E%3C/g%3E%3Cg transform='translate(500,90)'%3E%3Crect x='0' y='0' width='120' height='80' rx='8' fill='%23d4a574' opacity='0.5'/%3E%3Crect x='10' y='10' width='100' height='60' rx='4' fill='%23f4f4f4'/%3E%3Ccircle cx='60' cy='40' r='15' fill='%23d4a574'/%3E%3C/g%3E%3C/svg%3E"
          alt="Restaurant interior with wooden tables and chairs"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Business Info Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            {/* Business Logo */}
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">🍔</span>
            </div>

            {/* Business Details */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">
                Business Name
              </h1>
              <p className="text-gray-600">Dining</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button onClick={handleCallClick}>
              <Phone className="w-4 h-4" />
              <span>Call</span>
            </Button>
            <Button onClick={handleDirectionsClick}>
              <span>Get Directions</span>
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-8 border-b border-gray-200 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === tab.id
                  ? "border-bg-primabg-bg-primary-dark2 text-bg-primary-dark2"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Information */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Contact
            </h2>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-gray-600">
                <MapPin className="w-5 h-5 text-gray-400" />
                <span>Address line 1, City, State</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Phone className="w-5 h-5 text-gray-400" />
                <span>(123) 456-7390</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Mail className="w-5 h-5 text-gray-400" />
                <span>info@business.com</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-600">
                <Globe className="w-5 h-5 text-gray-400" />
                <span>business.com</span>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="bg-gray-100 rounded-lg overflow-hidden h-64">
            <div className="relative w-full h-full">
              {/* Mock Map with Location Pin */}
              <svg
                viewBox="0 0 400 256"
                className="w-full h-full"
                style={{
                  background:
                    "linear-gradient(45deg, #e5f3e5 0%, #f0f8f0 50%, #e8f5e8 100%)",
                }}
              >
                {/* Map Grid Lines */}
                <defs>
                  <pattern
                    id="grid"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M 40 0 L 0 0 0 40"
                      fill="none"
                      stroke="#d1d5db"
                      strokeWidth="1"
                      opacity="0.3"
                    />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Mock Streets */}
                <line
                  x1="0"
                  y1="128"
                  x2="400"
                  y2="128"
                  stroke="#fbbf24"
                  strokeWidth="4"
                  opacity="0.8"
                />
                <line
                  x1="200"
                  y1="0"
                  x2="200"
                  y2="256"
                  stroke="#fbbf24"
                  strokeWidth="4"
                  opacity="0.8"
                />
                <line
                  x1="100"
                  y1="0"
                  x2="100"
                  y2="256"
                  stroke="#fbbf24"
                  strokeWidth="2"
                  opacity="0.6"
                />
                <line
                  x1="300"
                  y1="0"
                  x2="300"
                  y2="256"
                  stroke="#fbbf24"
                  strokeWidth="2"
                  opacity="0.6"
                />

                {/* Location Pin */}
                <g transform="translate(200, 128)">
                  <circle
                    cx="0"
                    cy="-20"
                    r="15"
                    fill="#ea580c"
                    stroke="#fff"
                    strokeWidth="3"
                  />
                  <circle cx="0" cy="-20" r="6" fill="#fff" />
                  <path d="M 0 -5 L -8 8 L 8 8 Z" fill="#ea580c" />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessPage;

import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MapPin, Calendar, Clock } from "lucide-react";
import { useNavigate } from "react-router";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
  isPaid: boolean;
  price?: number; // in kobo
}

interface Place {
  id: number;
  name: string;
  category: string;
  location: string;
  image: string;
}

interface Collection {
  id: number;
  name: string;
  description: string;
  image: string;
}

interface FormData {
  fullName: string;
  email: string;
  tickets: string;
}

const EventDiscoveryApp: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRSVP, setShowRSVP] = useState<boolean>(false);
  const [rsvpSubmitted, setRsvpSubmitted] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    tickets: "1",
  });

  const handleEventClick = (event: Event): void => {
    setSelectedEvent(event);
    setShowRSVP(true);
    setRsvpSubmitted(false);
  };

  const navigate = useNavigate();

  const handleRSVPSubmit = (): void => {
    if (selectedEvent?.isPaid) {
      // Navigate to payment page for paid events
      navigate("/payment", {
        state: {
          eventDetails: {
            title: selectedEvent.title,
            price: selectedEvent.price,
            date: selectedEvent.date,
            location: selectedEvent.location,
          },
        },
      });
    } else {
      // Free event - just submit RSVP
      setRsvpSubmitted(true);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string): void => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const events: Event[] = [
    {
      id: 1,
      title: "Abuja Food Fest",
      date: "July 20, 2025",
      time: "12:00 PM - 6:00 PM",
      location: "Jabi Lake Mall, Abuja",
      description:
        "Join us for an unforgettable culinary experience featuring local and international food vendors, live music, games, and giveaways.",
      image: "/api/placeholder/300/200",
      isPaid: true,
      price: 5000, // ₦50 in kobo
    },
    {
      id: 2,
      title: "Free Community Cleanup",
      date: "July 25, 2025",
      time: "8:00 AM - 12:00 PM",
      location: "Central Park, Abuja",
      description:
        "Join us for a community cleanup event to make our city cleaner and greener.",
      image: "/api/placeholder/300/200",
      isPaid: false,
    },
  ];

  const places: Place[] = [
    {
      id: 1,
      name: "Café Aroma",
      category: "Dining",
      location: "Wuse II",
      image: "/api/placeholder/100/100",
    },
  ];

  const collections: Collection[] = [
    {
      id: 1,
      name: "Romantic Spots",
      description: "Curated restaurants for date nights",
      image: "/api/placeholder/100/100",
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="">
        <h1 className="text-3xl font-semibold mb-8">Discover</h1>

        <Tabs defaultValue="explore" className="w-full ">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger
              value="explore"
              className="data-[state=active]:bg-bg-primary-dark2 data-[state=active]:text-white"
            >
              Explore
            </TabsTrigger>
            <TabsTrigger
              value="events"
              className="data-[state=active]:bg-bg-primary-dark2 data-[state=active]:text-white"
            >
              Events
            </TabsTrigger>
            <TabsTrigger
              value="collections"
              className="data-[state=active]:bg-bg-primary-dark2 data-[state=active]:text-white"
            >
              Collections
            </TabsTrigger>
          </TabsList>

          <TabsContent value="explore" className="space-y-6">
            <h2 className="text-2xl font-semibold text-text-primary mb-6">
              Explore Nearby
            </h2>
            <div className="space-y-4">
              {places.map((place: Place) => (
                <div
                  key={place.id}
                  className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border border-border-primary"
                >
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0">
                    <img
                      src={place.image}
                      alt={place.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">
                      {place.name}
                    </h3>
                    <p className="text-gray-600">
                      Category: {place.category} • Location: {place.location}
                    </p>
                  </div>
                </div>
              ))}

              {events.map((event: Event) => (
                <div
                  key={event.id}
                  className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border border-border-primary cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleEventClick(event)}
                >
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{event.title}</h3>
                    <p className="text-gray-600">
                      Date: July 12 • Location: {event.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <h2 className="text-2xl font-semibold text-text-primary mb-6">
              Upcoming Events
            </h2>
            <div className="space-y-4">
              {events.map((event: Event) => (
                <div
                  key={event.id}
                  className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleEventClick(event)}
                >
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-blue-600">
                      {event.title}
                    </h3>
                    <p className="text-gray-600">
                      Date: July 12 • Location: {event.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="collections" className="space-y-6">
            <h2 className="text-2xl font-semibold text-text-primary mb-6">
              Top Collections
            </h2>
            <div className="space-y-4">
              {collections.map((collection: Collection) => (
                <div
                  key={collection.id}
                  className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border"
                >
                  <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-text-primary">
                      {collection.name}
                    </h3>
                    <p className="text-gray-600">{collection.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Event Detail Modal */}
        <Dialog open={showRSVP} onOpenChange={setShowRSVP}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedEvent && (
              <div className="space-y-6">
                <div className="w-full h-48 bg-gray-200 rounded-lg overflow-hidden">
                  <img
                    src={selectedEvent.image}
                    alt="Event Banner"
                    className="w-full h-full object-cover"
                  />
                </div>

                <DialogHeader>
                  <DialogTitle className="text-3xl font-normal text-blue-500">
                    {selectedEvent.title}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-3 text-text-primary">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span className="font-medium">Date:</span>
                    <span>{selectedEvent.date}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">Time:</span>
                    <span>{selectedEvent.time}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span className="font-medium">Location:</span>
                    <span>{selectedEvent.location}</span>
                  </div>
                  <div className="pt-2">
                    <span className="font-medium">Description:</span>
                    <p className="mt-1">{selectedEvent.description}</p>
                  </div>
                  {selectedEvent.isPaid && (
                    <div className="pt-2">
                      <span className="font-medium">Price:</span>
                      <span className="ml-2 text-lg font-semibold text-bg-primary-dark2">
                        ₦{((selectedEvent.price || 0) / 100).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                {!rsvpSubmitted ? (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-normal text-yellow-600">
                      RSVP Now
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <Label
                          htmlFor="fullName"
                          className="text-base font-normal"
                        >
                          Full Name
                        </Label>
                        <Input
                          id="fullName"
                          value={formData.fullName}
                          onChange={(e) =>
                            handleInputChange("fullName", e.target.value)
                          }
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="email"
                          className="text-base font-normal"
                        >
                          Email Address
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label
                          htmlFor="tickets"
                          className="text-base font-normal"
                        >
                          Number of Tickets
                        </Label>
                        <Input
                          id="tickets"
                          type="number"
                          min="1"
                          value={formData.tickets}
                          onChange={(e) =>
                            handleInputChange("tickets", e.target.value)
                          }
                          className="mt-1"
                        />
                      </div>

                      <Button
                        onClick={handleRSVPSubmit}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2"
                      >
                        {selectedEvent.isPaid
                          ? "Proceed to Payment"
                          : "Submit RSVP"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  !selectedEvent.isPaid && (
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl">🎉</span>
                        <div>
                          <p className="font-medium text-text-primary">
                            Thanks for RSVPing! You're all set for this free
                            event.
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default EventDiscoveryApp;

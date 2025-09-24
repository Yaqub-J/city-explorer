import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/context/ToastContext";
import { Calendar, MapPin } from "lucide-react";

const BusinessEvents = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [events, setEvents] = useState(eventsCard);
  const [newEvent, setNewEvent] = useState({
    event: "",
    date: "",
    location: "",
    description: "",
  });
  const { showToast } = useToast();

  const handleAddEvent = () => {
    if (!newEvent.event || !newEvent.date || !newEvent.location) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    const eventToAdd = {
      id: events.length + 1,
      ...newEvent,
    };

    setEvents([...events, eventToAdd]);
    setNewEvent({ event: "", date: "", location: "", description: "" });
    setShowAddModal(false);
    showToast("Event added successfully!", "success");
  };

  const handleViewDetails = (event: any) => {
    setSelectedEvent(event);
    setShowDetailsModal(true);
  };

  return (
    <div className="w-full">
      <div className="flex justify-between">
        <h3 className="font-bold">My Events</h3>
        <Button onClick={() => setShowAddModal(true)}>Add New</Button>
      </div>
      <div className="mt-8 flex flex-col gap-4">
        {events.map((item) => (
          <div
            className="bg-white border-1 border-border-primary rounded-md w-full p-6 flex items-center justify-between"
            key={item.id}
          >
            <div className="flex flex-col gap-2">
              <h4 className="font-bold">{item.event}</h4>
              <p className="text-base">Date: {item.date}</p>
              <p className="text-base">Location: {item.location}</p>
            </div>
            <Button onClick={() => handleViewDetails(item)}>View Details</Button>
          </div>
        ))}
      </div>

      {/* Add Event Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="eventTitle">Event Title</Label>
              <Input
                id="eventTitle"
                value={newEvent.event}
                onChange={(e) => setNewEvent({ ...newEvent, event: e.target.value })}
                placeholder="Enter event title"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="eventDate">Date</Label>
              <Input
                id="eventDate"
                type="date"
                value={newEvent.date}
                onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="eventLocation">Location</Label>
              <Input
                id="eventLocation"
                value={newEvent.location}
                onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                placeholder="Enter event location"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="eventDescription">Description</Label>
              <textarea
                id="eventDescription"
                value={newEvent.description}
                onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="Enter event description"
                rows={3}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-bg-primary-dark2 focus:border-transparent resize-vertical"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <Button onClick={handleAddEvent} className="flex-1 bg-bg-primary-dark2 hover:bg-bg-primary-dark2/90">
                Save Event
              </Button>
              <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Event Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="max-w-lg">
          {selectedEvent && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">{selectedEvent.event}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="font-medium">Date:</span>
                    <span className="ml-2">{selectedEvent.date}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="font-medium">Location:</span>
                    <span className="ml-2">{selectedEvent.location}</span>
                  </div>
                </div>
                {selectedEvent.description && (
                  <div>
                    <span className="font-medium">Description:</span>
                    <p className="mt-1 text-gray-600">{selectedEvent.description}</p>
                  </div>
                )}
                <div className="pt-4">
                  <Button onClick={() => setShowDetailsModal(false)} className="w-full">
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

const eventsCard = [
  {
    id: 1,
    event: "Pop-Up Fashion Market",
    date: "Aug 10, 2025",
    location: "City Mall Courtyard",
  },
  {
    id: 2,
    event: "Afro Music Night",
    date: "Aug 18, 2025",
    location: "Urban Sound Garden",
  },
];

export default BusinessEvents;

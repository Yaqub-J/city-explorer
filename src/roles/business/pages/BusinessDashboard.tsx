import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";
import profileImg from "@/assets/image.jpg";

const BusinessDashboard = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="bg-white border-1 border-border-primary rounded-md w-full p-6 flex items-center gap-3">
        <div className="rounded-full border border-border-primary h-20 w-20 overflow-hidden">
          <img
            src={profileImg}
            alt="Business profile"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-bold">Beauty Bliss</h3>
          <p className="text-base">Top-rated spa and salon</p>
        </div>
      </div>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {dashboardCard.map((item) => (
          <div
            className="bg-white border-1 border-border-primary rounded-md w-full p-6 flex flex-col gap-8"
            key={item.id}
          >
            <h4 className="font-bold">{item.header}</h4>
            <p className="text-base">{item.text}</p>
            <Button onClick={() => navigate(item.navigateTo)}>Add New</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

const dashboardCard = [
  {
    id: 1,
    header: "Upcoming Events",
    text: "No events scheduled",
    navigateTo: "/events",
  },
  {
    id: 2,
    header: "Deals & Promos",
    text: "No active promotions",
    navigateTo: "/events",
  },
  { id: 3, header: "Reviews", text: "View feedback", navigateTo: "/events" },
];

export default BusinessDashboard;

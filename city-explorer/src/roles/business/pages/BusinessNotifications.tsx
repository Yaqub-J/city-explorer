const BusinessNotifications = () => {
  return (
    <div className="w-full">
      <div className="flex justify-between">
        <h3 className="font-bold">Notifications</h3>
      </div>
      <div className="mt-8 flex flex-col gap-4">
        {dealsCard.map((item) => (
          <div
            className="bg-white border-1 border-border-primary rounded-md w-full p-6 flex items-center justify-between"
            key={item.id}
          >
            <div className="flex flex-col gap-2">
              <p className="text-base">{item.notification}</p>
              <p className="text-sm text-gray-500">{item.time}</p>
            </div>
            {/* <Button onClick={() => console.log(item.id)}>View Details</Button> */}
          </div>
        ))}
      </div>
    </div>
  );
};

const dealsCard = [
  {
    id: 1,
    notification: "Your event 'Artisan Market' has been approved!",
    time: "2 hours ago",
  },
  {
    id: 2,
    notification: "You received a new review from Alex: Great experience!",
    time: "5 hours ago",
  },
  {
    id: 3,
    notification: "Your deal '20% Off Lunch' has 15 new clicks today!",
    time: "1 day ago",
  },
];

export default BusinessNotifications;

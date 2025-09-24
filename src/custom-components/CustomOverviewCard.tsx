import React from "react";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
  key?: string | number;
  onClick: () => void;
  title: string;
  icon: React.ReactNode;
};

const CustomOverviewCard = ({ onClick, title, icon }: Props) => {
  return (
    <Card
      className="bg-bg-primary w-full min-w-[18.2em] cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="px-8 py-6">
        <div className="flex justify-between items-center">
          <p className="text-sm md:text-base font-medium w-1/4">{title}</p>
          <div className="px-1 py-2 rounded-2xl mb-2 w-12">{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomOverviewCard;
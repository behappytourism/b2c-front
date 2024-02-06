import React, { FC } from "react";

export interface SaleOffBadgeProps {
  className?: string;
  desc?: string;
}

const SaleOffBadge: FC<SaleOffBadgeProps> = ({
  className = "",
  desc = "-10% today",
}) => {
  return (
    <div
      className={`nc-SaleOffBadge flex items-center justify-center text-xs px-2.5 py-1 bg-orange-600 text-red-50 ${className}`}
      data-nc-id="SaleOffBadge"
    >
      {desc}
    </div>
  );
};

export default SaleOffBadge;

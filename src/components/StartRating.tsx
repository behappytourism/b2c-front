import { StarIcon } from "@heroicons/react/24/solid";
import React, { FC } from "react";

export interface StartRatingProps {
  className?: string;
  point?: number;
  reviewCount?: number;
}

const StartRating: FC<StartRatingProps> = ({
  className = "",
  point = 4.5,
  reviewCount = 112,
}) => {
  
  return (
    <div
      className={`nc-StartRating flex items-center space-x-1 text-sm  ${className}`}
      data-nc-id="StartRating"
    >
      {/* <div className="pb-[2px]">
        <StarIcon className="md:w-[18px] w-[12px] h-[12px] md:h-[18px] text-orange-500" />
      </div> */}
      {/* <span className="font-medium text-xs md:text-sm">{point}</span>
      <span className="text-neutral-500 text-xs md:text-sm dark:text-neutral-400">
        ({reviewCount})
      </span> */}
    </div>
  );
};

export default StartRating;

import React from "react";

function TestimonialCard() {
  return (
    <div className="w-full space-y-4 min-w-[400px] relative max-w-[400px] min-h-[300px] border rounded-3xl p-6">
      <div className="flex justify-between">
        <div className="flex gap-3">
          <div className="h-14 w-14 rounded-full flex flex-col items-center text-center text-white justify-center bg-blue-700">
            <p className="text-lg">T</p>
          </div>
          <div>
            <p>Tony Stark</p>
            <p>"Great Experience"</p>
          </div>
        </div>

        <div>
          <p>stars</p>
        </div>
      </div>

      <hr />

      <div>
        <p className="md:text-sm text-xs opacity-60 break-words whitespace-normal">
          Our desert safari experience was nothing short of fantastic! Right
          from the moment we were picked up to the time we were dropped off,
          every aspect was meticulously organized and executed. Our driver was
          not only skilled behind the wheel but also incredibly informative,
          providing us with fascinating insights throughout the journey.
        </p>
      </div>
    </div>
  );
}

export default TestimonialCard;

import Image from "next/image";
import React, { FC } from "react";
import starIcon from "../../../public/star.png"

interface TestimonialsProps {
  data: {
    description: string;
    image: string;
    name: string;
    place: string;
    rating: string;
  }
}


const TestimonialCard: FC<TestimonialsProps> = ({data}) => {
  return (
    <div className="w-full space-y-4 md:min-w-[400px] max-w-[325px] relative md:max-w-[400px] min-h-[300px] border rounded-3xl p-3 md:p-6">
      <div className="flex justify-between">
        <div className="flex gap-3">
          <div className="h-14 w-14 overflow-hidden border rounded-full flex flex-col items-center text-center text-white justify-center">
            <Image className="scale-150" src={process.env.NEXT_PUBLIC_CDN_URL + data.image} height={1000} width={1000} alt="testimonial user image" />
          </div>
          <div>
            <p className="text-lg font-semibold">{data.name}</p>
            <p className="text-sm font-semibold">{data.place}</p>
          </div>
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex">

          {Array.from({ length: Number(data.rating) }).map((_, index) => (
            <Image key={index} className="w-6 h-6" height={1000} width={1000} src={starIcon} alt="star icon" />
          ))}
          </div>
        </div>
      </div>

      <hr />

      <div>
        <p className="md:text-sm text-xs opacity-60 break-words whitespace-normal">
          {data.description}
        </p>
      </div>
    </div>
  );
}

export default TestimonialCard;

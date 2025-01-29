import Image from "next/image";
import React from "react";
import wcu1 from "../../../public/wcu_1.jpeg";
import wcu2 from "../../../public/wcu_2.jpeg";
import wcu3 from "../../../public/wcu_3.jpeg";
import wcu4 from "../../../public/wcu_4.jpeg";
import wcu5 from "../../../public/wcu_5.jpeg";

function WhyChooseUsSection() {
  return (
    <div className="md:flex gap-20 container">
      <div className="flex flex-col justify-center space-y-8 md:space-y-10">
        <div className="bg-gray-100 w-fit px-4 py-3 rounded-3xl">
          <p className="font-semibold">Why Choose Us</p>
        </div>

        <div>
          <h2 className="font-extrabold text-3xl md:text-5xl">
            Dive Into Exciting Dubai Adventures with Effortless Planning and
            Unforgettable Experiences
          </h2>
        </div>

        <div>
          <p className="md:text-xl text-lg font-semibold opacity-60">
            We bring UAE's best experiences to your fingertips. Our website
            offers easy navigation, curated travel options, and exclusive deals
            to help you explore Dubai like never before. Whether you're looking
            for luxury, adventure, or culture, we've got everything you need for
            a seamless and memorable journey.
          </p>
        </div>
      </div>

      <div className="flex md:flex-row flex-col gap-4">
        <div className="flex flex-col gap-4 pt-20">
          <div className="border rounded-2xl md:min-w-[300px] relative overflow-hidden cursor-pointer md:max-w-[300px] md:min-h-[300px]">
            <Image
              src={wcu1}
              height={1000}
              width={1000}
              alt="why choose us #1"
            />
            <span className="opacity-0 w-full absolute right-10 hover:opacity-100 inset-0 bg-black bg-opacity-40 transition-all duration-300 group-hover:transition-all group-hover:duration-300"></span>
            <div className="absolute text-white z-30 top-8 left-4">
              <p className="text-2xl font-semibold">1000+ Activities</p>
              <p>our expert team handpicked all activities for you.</p>
            </div>
          </div>

          <div className="border rounded-2xl min-w-[300px] cursor-pointer relative overflow-hidden md:max-w-[300px] min-h-[200px]">
            <Image
              src={wcu2}
              height={1000}
              width={1000}
              alt="why choose us #1"
            />
            <span className="opacity-0 w-full absolute right-10 hover:opacity-100 inset-0 bg-black bg-opacity-40 transition-all duration-300 group-hover:transition-all group-hover:duration-300"></span>
            <div className="absolute text-white z-30 bottom-3 left-4">
              <p className="text-2xl font-semibold">900K+ Happy Travelers</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="border rounded-2xl min-w-[300px] cursor-pointer relative overflow-hidden md:max-w-[300px] min-h-[200px]">
            <Image
              src={wcu3}
              height={1000}
              width={1000}
              alt="why choose us #1"
            />
            <span className="opacity-0 w-full absolute right-10 hover:opacity-100 inset-0 bg-black bg-opacity-40 transition-all duration-300 group-hover:transition-all group-hover:duration-300"></span>
            <div className="absolute text-white z-30 bottom-4 left-4">
              <p className="text-2xl font-semibold">Great 24/7 Support </p>
              <p>
                We are here to help, before, during, and even after your trip.
              </p>
            </div>
          </div>

          <div className="border rounded-2xl min-w-[300px] cursor-pointer relative overflow-hidden md:max-w-[300px] min-h-[300px]">
            <Image
              src={wcu4}
              height={1000}
              width={1000}
              alt="why choose us #1"
            />
            <span className="opacity-0 w-full absolute right-10 hover:opacity-100 inset-0 bg-black bg-opacity-40 transition-all duration-300 group-hover:transition-all group-hover:duration-300"></span>
            <div className="absolute text-white z-30 top-4 left-4">
              <p className="text-2xl font-semibold">Fast & Easy Booking</p>
              <p>Secure & Safe payment</p>
            </div>
          </div>

          <div className="border rounded-2xl min-w-[300px] cursor-pointer relative overflow-hidden md:max-w-[300px] min-h-[200px]">
            <Image
              src={wcu5}
              height={1000}
              width={1000}
              alt="why choose us #1"
            />
            <span className="opacity-0 w-full absolute right-10 hover:opacity-100 inset-0 bg-black bg-opacity-40 transition-all duration-300 group-hover:transition-all group-hover:duration-300"></span>
            <div className="absolute text-white z-30 bottom-3 left-4">
              <p className="text-2xl font-semibold">Best Price Guaranteed </p>
              <p>
                Price match within 48 hours of order confirmation - guaranteed!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhyChooseUsSection;

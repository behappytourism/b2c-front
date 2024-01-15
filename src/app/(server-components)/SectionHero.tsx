import React, { FC } from "react";
import imagePng from "@/images/hero-right.png";
import HeroSearchForm, { SearchTab } from "../(client-components)/(HeroSearchForm)/HeroSearchForm";
import Image from "next/image";
import ButtonPrimary from "@/shared/ButtonPrimary";

export interface SectionHeroProps {
  className?: string;
  currentPage: "Stays" | "Experiences" | "Visa" | "Flights";
  currentTab: SearchTab;
}

const SectionHero: FC<SectionHeroProps> = ({
  className = "",
  currentPage,
  currentTab,
}) => {

  const backgroundImage = process.env.NEXT_PUBLIC_BANNER_IMAGE;

  return (
    <div
      style={{
        background: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
      className={`nc-SectionHero flex flex-col-reverse lg:flex-col relative ${className}`}
    >
      <div className="absolute inset-0 bg-primary-300/40" />
      {/* <div className="flex flex-col lg:flex-row lg:items-center">
        <div className="flex-shrink-0 lg:w-1/2 flex flex-col items-start space-y-8 sm:space-y-10 pb-14 lg:pb-64 xl:pr-14 lg:mr-10 xl:mr-0">
        <h2 className="font-medium text-4xl md:text-5xl xl:text-7xl !leading-[114%] ">
        Hotel, car & experiences
        </h2>
        <span className="text-base md:text-lg text-neutral-500 dark:text-neutral-400">
        Accompanying us, you have a trip full of experiences. With Chisfis,
        booking accommodation, resort villas, hotels
        </span>
        <ButtonPrimary href="/listing-stay-map" sizeClass="px-5 py-4 sm:px-7">
        Start your search
          </ButtonPrimary>
        </div>
        <div className="flex-grow">
          <Image className="w-full" src={imagePng} alt="hero" priority />
          </div>
        </div> */}

      <div className=" container flex justify-center  mb-12 lg:mb-0 lg:mt-10 w-full ">
        <HeroSearchForm currentPage={currentPage} currentTab={currentTab} />
      </div>
    </div>
  );
};

export default SectionHero;

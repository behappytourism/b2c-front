import React, { FC } from "react";
import imagePng from "@/images/hero-right.png";
import HeroSearchForm, { SearchTab } from "../(client-components)/(HeroSearchForm)/HeroSearchForm";
import Image from "next/image";
import ButtonPrimary from "@/shared/ButtonPrimary";
import bannerImg from '@/images/dubaibanner.png'

export interface SectionHeroProps {
  className?: string;
  currentPage: "Stays" | "Experiences" | "Visa" | "Flights" | "Transfer";
  currentTab: SearchTab;
}

export interface bannerImages {
  img: string
}

const SectionHero: FC<SectionHeroProps> = ({
  className = "",
  currentPage,
  currentTab,
}) => {

  const backgroundImage = process.env.NEXT_PUBLIC_BANNER_IMAGE;


  return (
    <div
    className="relative"
      // style={{
      //   background: `url(${backgroundImage})`,
      //   backgroundSize: 'cover',
      //   backgroundPosition: 'center',
      //   backgroundRepeat: 'no-repeat',
      //   height: '500px',
      // }}
      // className={`nc-SectionHero flex flex-col-reverse lg:flex-col relative ${className}`}
    >

      {/* want old desing unComment this */}
      {/* <div className="absolute inset-0 bg-primary-300/40" /> */}

      {/* want old desing comment this */}

      {/* Other Desing */}
      <div className="hidden md:flex flex-col  z-0 lg:flex-row lg:items-center ">
        <div className="flex-shrink-0 z-0 lg:w-1/2 flex flex-col items-start space-y-8 sm:space-y-10 xl:pr-14 lg:mr-10 xl:mr-0">
        <h2 className="font-medium text-3xl z-0 !leading-[10%] px-10">
        Attractions & Transfer
        </h2>
        <span className="text-base z-0 md:text-lg text-neutral-500 dark:text-neutral-400 px-10">
        Accompanying us, you have a trip full of experiences. With Chisfis,
        booking accommodation, resort villas, hotels
        </span>
        
        </div>
        <div className="flex-grow px-2 z-0 py-3">
          <Image className="w-full z-0" width={700} height={700} src={bannerImg} alt="hero" />
          </div>
        </div>
      <div className="hidden container md:flex justify-center lg:mb-0 lg:mt-10 w-full absolute left-44 right-0  top-[280px]">
        <HeroSearchForm currentPage={currentPage} currentTab={currentTab} />
      </div>

      {/* <div className=" container flex justify-center  mb-12 lg:mb-0 lg:mt-10 w-full ">
        <HeroSearchForm currentPage={currentPage} currentTab={currentTab} />
      </div> */}
    </div>
  );
};

export default SectionHero;

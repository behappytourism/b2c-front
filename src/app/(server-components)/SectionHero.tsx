import React, { FC, useEffect, useState } from "react";
import imagePng from "@/images/hero-right.png";
import HeroSearchForm, { SearchTab } from "../(client-components)/(HeroSearchForm)/HeroSearchForm";
import Image from "next/image";
import ButtonPrimary from "@/shared/ButtonPrimary";
import bannerImg from '@/images/dubaibanner.png'
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import BgGlassmorphism from "@/components/BgGlassmorphism";
import ExperiencesSearchForm from "../(client-components)/(HeroSearchForm)/(experiences-search-form)/ExperiencesSearchForm";

export interface SectionHeroProps {
  className?: string;
  currentPage: "Stays" | "Experiences" | "Visa" | "Flights" | "Transfer";
  currentTab: SearchTab;
  imgBanner: bannerImages[];
}

export interface bannerImages {
  img: string
}

const SectionHero: FC<SectionHeroProps> = ({
  className = "",
  currentPage,
  currentTab,
  imgBanner
}) => {

  const backgroundImage = process.env.NEXT_PUBLIC_BANNER_IMAGE;
  const [banner, setBanner] = useState(imgBanner);
  const [currentSlide, setCurrentSlide] = useState(0);

  const updateCurrentSlide = (index: number) => {
    if (currentSlide !== index) {
      setCurrentSlide(index);
    }
  };

 
  

  return (
    <main className="nc-PageHome md:min-h-[500px] relative">
    {/* {!banner && (
      <> */}

        {/* <div className="relative md:mb-16 mb-16 lg:mb-16">
      <SectionHero
        currentPage="Transfer"
        currentTab="Transfer"
        className="hidden lg:block top-[400px] lg:pt-16 lg:pb-16 -ml-[300px]"
      />

      <div className=" relative container space-y-10 lg:space-y-12 mt-[500px]"></div>
    </div> */}

        <div className="hidden md:grid md:grid-cols-1 ">
          <Carousel
            infiniteLoop
            autoPlay
            showThumbs={false}
            interval={9000}
            showArrows={false}
            stopOnHover
            swipeable={false}
            selectedItem={currentSlide}
            showIndicators={false}
            showStatus={false}
            onChange={updateCurrentSlide}
          >
            {banner &&
              banner?.map((item: any, index: number) => (
                <>
                  <div className="absolute z-20 xl:bottom-20 md:bottom-[15em] lg:bottom-[9.5em]">
                    <p
                      className="ml-10 cursor-pointer -mb-10 text-2xl font-bold text-gray-400 hover:text-gray-400 bg-transparent border-2 transition-all duration-300 border-white hover:bg-soft h-14 w-14 rounded-full flex justify-center items-center"
                      onClick={() => setCurrentSlide(currentSlide + 1)}
                    >
                      <ChevronRightIcon />
                    </p>
                  </div>

                  <div
                    onClick={() => {
                      if (item?.buttonUrl !== "") {
                        window.open(`${item.buttonUrl}`, "_blank");
                      }
                    }}
                    className="bg-inherit cursor-pointer h-[20em] md:h-[30em] relative object-cover"
                    key={index}
                  >
                    <p className="absolute  -top-[350px] text-center w-full z-10">
                      <div className="h-[20em] xl:h-[28em] lg:h-[23em] md:h-[18em] sm:h-[22em] flex flex-col justify-end">
                        <div className="flex justify-center">
                          <p
                            className="text-3xl w-fit  bg-black/50 p-2 text-white font-extrabold  heading uppercase"
                            style={{
                              textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                              backgroundColor: item.title
                                ? "rgba(0, 0, 0, 0.5)"
                                : "transparent",
                            }}
                          >
                            {item?.title}
                          </p>

                          <div
                            className=" text-sm text-white font-medium"
                            style={{
                              textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
                            }}
                          >
                            {item?.description}
                          </div>
                        </div>
                      </div>
                    </p>
                    <Image
                      src={`${process.env.NEXT_PUBLIC_SERVER_URL}${
                        item.image || ""
                      }`}
                      alt={`Slide ${index + 1}`}
                      width={1000}
                      height={100}
                      className=""
                    />
                  </div>
                </>
              ))}
          </Carousel>
        </div>

        <div className="container w-full md:flex hidden justify-center  -mt-[160px]">
          <div className="sticky z-40 -ml-[550px]">
          <HeroSearchForm currentPage={currentPage} currentTab={currentTab} />
          <div className="mt-3">
          <ExperiencesSearchForm />
          </div>
          </div>
        </div>
      {/* </>
    )} */}
  </main>
  );
};

export default SectionHero;

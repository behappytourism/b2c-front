import React, { FC, useEffect, useState } from "react";
import imagePng from "@/images/hero-right.png";
import HeroSearchForm, { SearchTab } from "../(client-components)/(HeroSearchForm)/HeroSearchForm";
import Image from "next/image";
import ButtonPrimary from "@/shared/ButtonPrimary";
import bannerImg from '@/images/dubaibanner.png'
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { ChevronRightIcon } from "@heroicons/react/24/solid";

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
  const [banner, setBanner] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const updateCurrentSlide = (index: number) => {
    if (currentSlide !== index) {
      setCurrentSlide(index);
    }
  };

  const findBanner = async () => {
    try {
      const banner = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/v1/home/banners?name=home`,
        { next: { revalidate: 1 } }
      );
      return banner.json();
    } catch (error) {
      console.log(error);
    }
  };

  async function bannerFound() {
    try {
      const response = await findBanner();
      setBanner(response);
    } catch (error) {
      console.error(error);
    }
  }

  console.log(banner);
  
   useEffect(() => {
    bannerFound()
   },[])


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
            banner.map((item: any, index: number) => (
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
                  onClick={() => window.open(`${item?.buttonUrl}`, "_blank")}
                  className="bg-inherit cursor-pointer h-[20em] md:h-[30em] relative object-cover"
                  key={index}
                >
                  <p className="absolute  top-0 text-center w-full z-10">
                    <div className="h-[20em] xl:h-[28em] lg:h-[23em] md:h-[18em] sm:h-[22em] flex flex-col justify-end">
                      <div className="">
                        <div
                          className="text-3xl text-white font-extrabold  heading uppercase"
                          style={{
                            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                          }}
                        >
                          {item?.title}
                        </div>
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
                    src={`${process.env.NEXT_PUBLIC_SERVER_URL}${item.image || ""}`}
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
      {/* <div className="hidden md:flex flex-col  z-0 lg:flex-row lg:items-center ">
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
        </div> */}
      <div className="hidden container md:flex justify-center lg:mb-0 lg:mt-10 w-full absolute left-[500px] right-0  top-[150px]">
        <HeroSearchForm currentPage={currentPage} currentTab={currentTab} />
      </div>

      {/* <div className=" container flex justify-center  mb-12 lg:mb-0 lg:mt-10 w-full ">
        <HeroSearchForm currentPage={currentPage} currentTab={currentTab} />
      </div> */}
    </div>
  );
};

export default SectionHero;
